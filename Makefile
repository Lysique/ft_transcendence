all: build
	docker compose up

build:
	docker compose build

up:
	docker compose up

down:
	docker compose down

clean:
	docker compose down -v --rmi all --remove-orphans

fclean: clean
	docker system prune --volumes -af
	docker network prune -f
	docker image prune -f

re: fclean all

.PHONY: all clean fclean re