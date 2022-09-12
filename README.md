# What's the goal of the project?
This project is about creating a web app for the mighty Pong contest!

## Main features
Users can login using the OAuth system of the school's intranet and enable two-factor authentication as well as add friends, see stats of the games they played, invite other users to join a game, etc.
In addition to that, users can send each other direct messages and create chat rooms.
Finally, they can play the mighty Pong game against each other or watch other players busy playing.

## Technical Implementation
- Programming language: Typescript
- Frontend: ReactJS & Material UI
- Runtime environment: Node
- Backend: NestJS
- Database: PostgreSQL
- Containerization: Docker

## How to build the project

### Root setup

- Copy of the template.env into .env and fill the database configuration

###  Backend setup

- Copy of the template.env in the src/common/envs into .env

- DATABASE_PASSWORD and DATABASE_NAME should match the configuration of the .env in the root folder

- FORTYTWO_ID and FORTYTWO_APP_SECRET will be given when registrating the app on the intra

- Copy constants.template.ts in src/auth/constants to constants.ts and choose a secret of your choice to configure the jwt strategy

### Frontend setup

- Copy of the template.env in the frontend root folder into .env and fill the backend information (ip and port)

## run testing database

```bash

# run testing container

# Change the db host in the ./backend/src/common/envs/.env to localhost
# Don't forget to change it to 'db' after if you want to run backend with docker.

# run the database from backend directory
$ docker run -h db --name postgres --env-file .env -p 5432:5432 -d postgres

#run adminer
$ docker run --link postgres:db --name adminer -p 8080:8080 -d adminer

# You can connect to adminer (localhost:8080) with :
# - System : PostgreSQL
# - Server : db
# - Username : postgres
# - Password : password provided in the ./backend/src/common/envs/.env file
# - Database : (blank)

# stop testing databases
$ docker stop postgres adminer
$ docker system prune -af
$ docker volume prune -f

```

Make sure docker is installed.
Clone this repository and simply run the `make` command while at the root of the repository and then navigate to `localhost:80/`.

If you want to run the project from one of school 42's mac, make sure to first launch the `init_docker.sh` script.