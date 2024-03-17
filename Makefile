commit:
	make test
	make format
	make lint
	git add -A
	./commit.sh
	git push --no-verify

up:
	docker compose up

up-d:
	docker compose up -d

log:
	docker compose logs -f

rebuild:
	docker compose build --no-cache

down:
	docker compose down

clean:
	docker compose down --rmi all

wipe:
	docker system prune -a --volumes

test:
	docker compose exec ankle npm run test

test-w:
	docker compose exec ankle npm run test:watch

generate:
	docker compose exec ankle npm run db:generate

push:
	docker compose exec ankle npm run db:push

seed:
	docker compose exec ankle npm run db:seed

migrate_dev:
	docker compose exec ankle npm run db:migrate:dev

db:
	docker compose exec ankle npm run db:migrate:dev
	docker compose exec ankle npm run db:generate
	docker compose exec ankle npm run db:push
	docker compose exec ankle npm run db:seed

lint:
	docker compose exec ankle npm run lint

format:
	docker compose exec ankle npm run format
