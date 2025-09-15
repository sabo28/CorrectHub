.PHONY: start
.PHONY: clean
.PHONY: check
.PHONY: test
.PHONY: sql
.PHONY: e2e

DRIZZLE = npx drizzle-kit generate --config drizzle.config.ts
DENO_TEST = deno test --allow-env --allow-net --allow-run --allow-read --doc --parallel

start: check
	docker compose up

clean:
	docker compose down

lint:
	deno lint

check:
	deno check

test: lint check
	DENO_NO_PACKAGE_JSON=1 $(DENO_TEST)

test-coverage: lint check
	DENO_NO_PACKAGE_JSON=1 $(DENO_TEST) --coverage=coverage

e2e: clean
	make clean
	npm run test

sql:
ifndef NAME
	$(DRIZZLE)
else
	$(DRIZZLE) --name $(NAME)
endif
