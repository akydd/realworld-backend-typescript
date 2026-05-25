.PHONY: dev migrate\:generate migrate\:revert migrate\:run int-tests

-include .env
export

SPECS_DIR ?= ../realworld

dev:
	docker compose up -d
	until docker compose exec -T db pg_isready -U admin -d app-ts; do sleep 1; done
	nest start --watch

migrate\:generate:
	npm run typeorm -- migration:generate src/migrations/$(name) -d src/data-source.ts

migrate\:revert:
	npm run typeorm -- migration:revert -d src/data-source.ts

migrate\:run:
	npm run typeorm -- migration:run -d src/data-source.ts

int-tests:
	docker compose -f compose.test.yaml up -d
	until docker compose -f compose.test.yaml exec -T test_db pg_isready -U admin -d test-app-ts; do sleep 1; done
	npm run build
	DB_HOST=localhost DB_PORT=8094 DB_USER=admin DB_PASSWORD=password DB_NAME=test-app-ts PORT=3001 node dist/main & echo $$! > server.pid
	sleep 2
	HOST=http://localhost:3001 $(SPECS_DIR)/specs/api/run-api-tests-hurl.sh; \
	RESULT=$$?; \
	kill $$(cat server.pid) 2>/dev/null || true; \
	rm -f server.pid; \
	docker compose -f compose.test.yaml exec -T test_db psql -U admin -d test-app-ts -c "TRUNCATE TABLE users CASCADE;"; \
	docker compose -f compose.test.yaml down; \
	exit $$RESULT
