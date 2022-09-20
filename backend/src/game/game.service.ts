import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { Games } from './models/entities/game.entity';
import { GamePlayer } from './models/entities/game_player.entity';
import { Server, Socket } from 'socket.io';
import { ConnectedSocket } from '@nestjs/websockets';
import { Ball, Game } from './classes/game.classes';
import { collision, resetBall, updateGame } from './utils/game.utils';
import { AuthService } from 'src/auth/auth.service';
import { UserDto } from 'src/models/users/dto/user.dto';
import { CreateGamePlayerDto } from './models/dto/create-gamePlayer.dto';
import { User } from 'src/models/users/entities/user.entity';

@Injectable()
export class GameService {
  constructor(
    private authService: AuthService,
    @InjectRepository(Games) private gamesRepository: Repository<Games>,
    @InjectRepository(User) private userRepository: Repository<User>,
    @InjectRepository(GamePlayer) private gamePlayerRepository: Repository<GamePlayer>,
    private dataSource: DataSource,
  ) {
    this.queue = new Map();
    this.gameSessions = new Map();
  }

  /* Queue and game sessions */
  public queue: Map<string, Socket>;
  public gameSessions: Map<string, Game>;

  /*
   **
   ** @Match Making
   **
   */

  async pushToQueue(client: Socket) {
    const currentUser: UserDto | null = await this.authService.getUserFromSocket(client);
    if (!currentUser) {
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

  async monitorQueue(server: Server): Promise<string> {
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
    return gameID;
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

    /* set up game */
    const gameInfo = new Game();
    gameInfo.player1.socketID = id1.id;
    gameInfo.player1.userName = user1.name;
    gameInfo.player1.userID = user1.id;
    gameInfo.player2.socketID = id2.id;
    gameInfo.player2.userName = user2.name;
    gameInfo.player2.userID = user2.id;
    gameInfo.gameStatus = 'running';

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
      updateGame(this.gameSessions.get(gameID));
      if (
        this.gameSessions.get(gameID).player1.score >= 5 ||
        this.gameSessions.get(gameID).player2.score >= 5 ||
        this.gameSessions.get(gameID).gameStatus === 'stopped'
      ) {
        clearInterval(myInterval);
        if (this.gameSessions.get(gameID).gameStatus === 'stopped') {
          server.to(gameID).emit('gameFinishedEarly', this.gameSessions.get(gameID).gameLoser);
        } else {
          if (this.gameSessions.get(gameID).player1.score >= 5) {
            this.gameSessions.get(gameID).gameWinner = this.gameSessions.get(gameID).player1.userName;
            this.gameSessions.get(gameID).gameLoser = this.gameSessions.get(gameID).player2.userName;
          } else {
            this.gameSessions.get(gameID).gameWinner = this.gameSessions.get(gameID).player2.userName;
            this.gameSessions.get(gameID).gameLoser = this.gameSessions.get(gameID).player1.userName;
          }
          this.gameSessions.get(gameID).gameStatus = 'stopped';
          server.to(gameID).emit('gameFinished', this.gameSessions.get(gameID).gameWinner);
          this.createGame().then(async (game) => {
            const player1Dto: CreateGamePlayerDto = {
              user: await this.userRepository.findOneBy({
                id: this.gameSessions.get(gameID).player1.userID,
              }),
              game: game,
              score: this.gameSessions.get(gameID).player1.score,
              winner: this.gameSessions.get(gameID).player1.score > this.gameSessions.get(gameID).player2.score,
            };

            const player2Dto: CreateGamePlayerDto = {
              user: await this.userRepository.findOneBy({
                id: this.gameSessions.get(gameID).player2.userID,
              }),
              game: game,
              score: this.gameSessions.get(gameID).player2.score,
              winner: this.gameSessions.get(gameID).player2.score > this.gameSessions.get(gameID).player1.score,
            };

            await this.createGamePlayer(player1Dto);
            await this.createGamePlayer(player2Dto);
          });
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

  //   customQuery(): any {
  // 	return this.gamesRepository.createQueryBuilder("games").select("id").where()
  //   }

  // async createMany(games: Games[]) {
  // 	const queryRunner = this.dataSource.createQueryRunner();

  // 	await queryRunner.connect();
  // 	await queryRunner.startTransaction();
  // 	try {
  // 	  await queryRunner.manager.save(games[0]);
  // 	  await queryRunner.manager.save(games[1]);

  // 	  await queryRunner.commitTransaction();
  // 	} catch (err) {
  // 	  // since we have errors lets rollback the changes we made
  // 	  await queryRunner.rollbackTransaction();
  // 	} finally {
  // 	  // you need to release a queryRunner which was manually instantiated
  // 	  await queryRunner.release();
  // 	}
  //   }
}
