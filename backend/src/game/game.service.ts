import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Games } from './models/entities/game.entity';
import { GamePlayer } from './models/entities/game_player.entity';
import { Server, Socket } from 'socket.io';
import { ConnectedSocket } from '@nestjs/websockets';
import { Game } from './classes/game.classes';
import { updateGame } from './utils/game.utils';
import { AuthService } from 'src/auth/auth.service';
import { UserDto } from 'src/models/users/dto/user.dto';
import { CreateGamePlayerDto } from './models/dto/create-gamePlayer.dto';
import { User, UserStatus } from 'src/models/users/entities/user.entity';
import { UsersService } from 'src/models/users/users.service';
import { Result } from './interfaces/game.interfaces';

@Injectable()
export class GameService {
  constructor(
    private authService: AuthService,
    private userService: UsersService,
    @InjectRepository(Games) private gamesRepository: Repository<Games>,
    @InjectRepository(User) private userRepository: Repository<User>,
    @InjectRepository(GamePlayer) private gamePlayerRepository: Repository<GamePlayer>,
  ) {
    this.queue = new Map();
    this.gameSessions = new Map();
    this.invitationList = new Map();
  }

  /* Queue and game sessions */
  public queue: Map<string, Socket>;
  public gameSessions: Map<string, Game>;
  public invitationList: Map<number, number[]>;

  /*
   **
   ** @Match Making
   **
   */

  async pushToQueue(client: Socket) {
    const currentUser: UserDto | null = await this.authService.getUserFromSocket(client);
    if (!currentUser || !this.authService.isUserConnected(currentUser.id)) {
      client.emit('errorMsg', 'You have to be logged in to join a game!');
      return;
    }
    if (this.queue.size === 1) {
      const userInQueue: UserDto | null = await this.authService.getUserFromSocket(
        this.queue.get(Array.from(this.queue.keys())[0]),
      );
      if (currentUser.id === userInQueue.id) {
        client.emit('errorMsg', 'You are already in queue, sit tight!');
        return;
      }
    }
    this.queue.set(client.id, client);
  }

  async removeFromQueue(client: Socket) {
    this.queue.delete(client.id);
  }

  async monitorQueue(server: Server) {
    let gameID: string;
    if (this.queue.size === 2) {
      gameID = this.queue.get(Array.from(this.queue.keys())[0]).id + this.queue.get(Array.from(this.queue.keys())[1]).id;

      await this.setUpGame(
        this.queue.get(Array.from(this.queue.keys())[0]),
        this.queue.get(Array.from(this.queue.keys())[1]),
        server,
      );
      this.queue.clear();
    }
  }

  /*
   **
   ** @Game logic
   **
   */

  /* Set up game once two players have been match-maked */
  async setUpGame(@ConnectedSocket() id1: Socket, @ConnectedSocket() id2: Socket, server: Server) {
    const user1: UserDto | null = await this.authService.getUserFromSocket(id1);
    const user2: UserDto | null = await this.authService.getUserFromSocket(id2);

    /* close all invitations */
    this.closeAllInvitationsFromUser(server, user1.id);
    this.closeAllInvitationsFromUser(server, user2.id);

    /* set up game */
    const gameInfo = new Game();
    gameInfo.player1.socketID = id1.id;
    gameInfo.player1.userName = user1.name;
    gameInfo.player1.userID = user1.id;
    gameInfo.player2.socketID = id2.id;
    gameInfo.player2.userName = user2.name;
    gameInfo.player2.userID = user2.id;
    gameInfo.gameStatus = 'running';

    /* update player status to 'In game' */
    await this.userService.setStatus(user1.id, UserStatus.InGame);
    await this.userService.setStatus(user2.id, UserStatus.InGame);

    /* set up room for game */
    gameInfo.gameID = id1.id + id2.id;
    id1.join(gameInfo.gameID);
    id2.join(gameInfo.gameID);

    /* add that game info to the gameSessions */
    this.gameSessions.set(gameInfo.gameID, gameInfo);

    /* send all active game sessions */
    const gameSessions = [];

    this.gameSessions.forEach((value: Game, key: string) => {
      if (value.gameStatus === 'running') {
        gameSessions.push(value);
      }
    });
    server.emit('currentGameSessions', gameSessions);

    server.to(gameInfo.gameID).emit('gameReady');
    server.to(gameInfo.gameID).emit('gameLaunched', this.gameSessions.get(gameInfo.gameID));
    await this.serverLoop(server, gameInfo.gameID);
  }

  /* Update game status in case one player left early or got disconnected */
  async updateGameStatus(@ConnectedSocket() client: Socket) {
    for (const key of this.gameSessions.keys()) {
      if (key.includes(client.id) === true) {
        let gameInfo: Game = this.gameSessions.get(key);
        const user: UserDto | null = await this.authService.getUserFromSocket(client);
        gameInfo.gameStatus = 'stopped';
        gameInfo.gameLoser = user.name;
        this.gameSessions.set(key, gameInfo);
      }
    }
  }

  /* Update a player's paddle position */
  updatePaddle(clientID: string, gameID: string, upOrDown: string, keyPress: boolean) {
    if (clientID == this.gameSessions.get(gameID).player1.socketID) {
      if (upOrDown == 'down') {
        this.gameSessions.get(gameID).player1.arrowDown = keyPress;
      } else if (upOrDown == 'up') {
        this.gameSessions.get(gameID).player1.arrowUp = keyPress;
      }
    } else if (clientID == this.gameSessions.get(gameID).player2.socketID) {
      if (upOrDown == 'down') {
        this.gameSessions.get(gameID).player2.arrowDown = keyPress;
      } else if (upOrDown == 'up') {
        this.gameSessions.get(gameID).player2.arrowUp = keyPress;
      }
    }
  }

  /*
   **
   ** @Server loop
   **
   */

  async serverLoop(server: Server, gameID: string) {
    const myInterval = setInterval(() => {
      const gameSession: Game = this.gameSessions.get(gameID);
      updateGame(gameSession);
      if (gameSession.player1.score >= 5 || gameSession.player2.score >= 5 || gameSession.gameStatus === 'stopped') {
        clearInterval(myInterval);
        if (gameSession.gameStatus === 'stopped') {
          server.to(gameID).emit('gameFinishedEarly', gameSession.gameLoser);
        } else {
          if (gameSession.player1.score >= 5) {
            gameSession.gameWinner = gameSession.player1.userName;
            gameSession.gameLoser = gameSession.player2.userName;
          } else {
            gameSession.gameWinner = gameSession.player2.userName;
            gameSession.gameLoser = gameSession.player1.userName;
          }
          gameSession.gameStatus = 'stopped';
          server.to(gameID).emit('gameFinished', gameSession.gameWinner);
          this.createGame().then(async (game) => {
            const player1Dto: CreateGamePlayerDto = {
              user: await this.userRepository.findOneBy({
                id: gameSession.player1.userID,
              }),
              game: game,
              score: gameSession.player1.score,
              winner: gameSession.player1.score > gameSession.player2.score,
            };

            const player2Dto: CreateGamePlayerDto = {
              user: await this.userRepository.findOneBy({
                id: gameSession.player2.userID,
              }),
              game: game,
              score: gameSession.player2.score,
              winner: gameSession.player2.score > gameSession.player1.score,
            };

            await this.createGamePlayer(player1Dto);
            await this.createGamePlayer(player2Dto);
          });
        }
        /* update player status to 'Online' */
        if (this.authService.isUserConnected(gameSession.player1.userID)) {
          this.userService.setStatus(gameSession.player1.userID, UserStatus.Online);
        }
        if (this.authService.isUserConnected(gameSession.player2.userID)) {
          this.userService.setStatus(gameSession.player2.userID, UserStatus.Online);
        }

        /* send all active game sessions */
        const gameSessions = [];

        this.gameSessions.forEach((value: Game, key: string) => {
          if (value.gameStatus === 'running') {
            gameSessions.push(value);
          }
        });
        server.emit('currentGameSessions', gameSessions);
      } else {
        server.to(gameID).emit('gameUpdate', this.gameSessions.get(gameID));
      }
    }, 1000 / 60);
  }

  /*
   **
   ** @Spectator
   **
   */

  sendGameSessions(server: Server, client: Socket) {
    const gameSessions = [];

    this.gameSessions.forEach((value: Game, key: string) => {
      if (value.gameStatus === 'running') {
        gameSessions.push(value);
      }
    });
    server.to(client.id).emit('currentGameSessions', gameSessions);
  }

  getCurrentGames() {
    const gameSessions = [];

    this.gameSessions.forEach((value: Game, key: string) => {
      if (value.gameStatus === 'running') {
        gameSessions.push(value);
      }
    });
    return gameSessions;
  }

  joinAsSpectator(client: Socket, roomID: string) {
    client.join(this.gameSessions.get(roomID).gameID);
  }
  /*
   **
   ** @InviteToGame
   **
   */

  closeAllInvitationsFromUser(server: Server, userID: number) {
    const invitedUsers: number[] = this.invitationList.get(userID);
    if (!invitedUsers) {
      return;
    }
    for (let i = 0; i < invitedUsers.length; ++i) {
      const invitedSockets = this.getSocketsFromUser(invitedUsers[i]);

      for (let j = 0; j < invitedSockets.length; ++j) {
        invitedSockets[j].join(userID.toString());
      }
    }
    this.invitationList.delete(userID);
    server.to(userID.toString()).emit('closeInvite');
    server.socketsLeave(userID.toString());
  }

  async addToInvitationList(client: Socket, invitedId: number) {
    const currentUser: UserDto | null = await this.authService.getUserFromSocket(client);

    let ids: number[] = this.invitationList.get(currentUser.id);
    if (!ids) {
      ids = [invitedId];
    } else {
      ids.push(invitedId);
    }
    this.invitationList.set(currentUser.id, ids);
  }

  //TODO: inviteeId instead of socket
  async removeFromInvitationList(inviteeSocket: Socket, inviterId: number) {
    const currentUser: UserDto | null = await this.authService.getUserFromSocket(inviteeSocket);

    let ids: number[] = this.invitationList.get(inviterId);
    console.log(ids);
    const index = ids.indexOf(currentUser.id);
    if (index > -1) {
      ids.splice(index, 1);
      this.invitationList.set(currentUser.id, ids);
    }
  }

  getSocketsFromUser(userID: number): Socket[] {
    const sockets: Socket[] = this.authService.getSocketsFromUser(userID);
    return sockets;
  }

  //TODO: return whole user instead of partial data
  async getUserFromSocket(client: Socket) {
    const userDto = await this.authService.getUserFromSocket(client);
    return userDto;
  }

  /*
   **
   ** @Database (TypeORM)
   **
   */

  createGame(): Promise<Games> {
    const newGame = this.gamesRepository.create();
    return this.gamesRepository.save(newGame);
  }

  createGamePlayer(gamePlayer: CreateGamePlayerDto): Promise<GamePlayer> {
    const newGamePlayer = this.gamePlayerRepository.create(gamePlayer);
    return this.gamePlayerRepository.save(newGamePlayer);
  }

  async getGameStatForPlayer(userID: number): Promise<Result[]> {
    const gameStats: GamePlayer[] = await this.gamePlayerRepository
      .createQueryBuilder('gamePlayer')
      .leftJoinAndSelect('gamePlayer.user', 'user')
      .leftJoinAndSelect('gamePlayer.game', 'game')
      .select(['gamePlayer.id', 'gamePlayer.score', 'gamePlayer.winner', 'user.name', 'game.id', 'game.date'])
      .orderBy('game.date', 'ASC')
      .where((qb) => {
        const subQuery = qb
          .subQuery()
          .from(Games, 'game')
          .leftJoin('game.gamePlayer', 'gamePlayer')
          .leftJoin('gamePlayer.user', 'user')
          .select(['game.id'])
          .where('user.id = :id', { id: userID })
          .getQuery();
        return 'game.id IN ' + subQuery;
      })
      .getMany();

    let results: Result[] = [];

    for (let i: number = 0; i < gameStats.length - 1; i++) {
      if (gameStats[i].game.id == gameStats[i + 1].game.id) {
        let result = {
          key: i,
          date: gameStats[i].game.date.toDateString(),
          winner: gameStats[i].winner ? gameStats[i].user.name : gameStats[i + 1].user.name,
          loser: gameStats[i].winner ? gameStats[i + 1].user.name : gameStats[i].user.name,
          scoreWinner: gameStats[i].winner ? gameStats[i].score : gameStats[i + 1].score,
          scoreLoser: gameStats[i].winner ? gameStats[i + 1].score : gameStats[i].score,
        };
        results.push(result);
      }
    }
    return results;
  }
}
