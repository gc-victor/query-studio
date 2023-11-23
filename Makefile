ARGUMENTS = $(filter-out $@,$(MAKECMDGOALS))

default: help

# Bundle

bundle:
	bun run build.js

bundle-dev:
	bun build $(ARGUMENTS) --root ./src --outdir ./dist --entry-naming [dir]/[name].[ext] --watch

bundle-dev-home:
	bun build ./src/pages/home/home.island.ts --root ./src --outdir ./dist --entry-naming [dir]/[name].[ext] --watch

bundle-dev-login:
	bun build ./src/pages/login/login.island.tsx --root ./src --outdir ./dist --entry-naming [dir]/[name].[ext] --watch

bundle-styles:
	bunx tailwindcss -i ./src/styles.css -o ./dist/styles.css --minify

# CSS

css:
	bunx tailwindcss -i ./src/styles.css -o ./dist/styles.css --watch

# Help

help: echo-bun ## Show this help
	@echo 'usage: make [target]'
	@echo
	@echo 'Targets:'
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | awk 'BEGIN {FS = ":.*?## "}; {printf "\033[36m%-20s\033[0m %s\n", $$1, $$2}'

# Hurl

.PHONY: hurl
hurl:
	hurl --verbose --continue-on-error --variables-file hurl/.env $(ARGUMENTS)

hurl-test:
	hurl --test --continue-on-error --variables-file hurl/.env $(ARGUMENTS)

hurl-test-all:
	hurl --test --continue-on-error --variables-file hurl/.env hurl/*.hurl

# Dependencies

dependencies: install-bun ## Initialize project
	bun install

install-bun: ## Install bun
    curl -fsSL https://bun.sh/install | bash

install-hurl:
	cargo install hurl

# Docker

docker-build:
	docker build -t query-studio .

docker-run:
	docker run -it -p 3000:3000 --env-file .env query-studio

# Server

server:
	bun run src/index.ts

server-dev:
	bun --hot run src/index.ts

server-debug:
	bun --inspect --hot run src/index.ts

# catch anything and do nothing
%:
	@: