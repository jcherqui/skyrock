.PHONY: build

install: ## Install dependencies
	@ yarn install

build: ## Build with babel
	@ mkdir -p build
	@ ./node_modules/.bin/babel src/ --out-dir build/ --compact true
	@ chmod +x build/index.js

run: ## Run with babel
	@ cp -n .env.dist .env
	@ ./node_modules/.bin/babel-node src/index.js

deploy:
	@ npm publish

lint:
	@ ./node_modules/.bin/eslint src/

lint-fix:
	@ ./node_modules/.bin/eslint --fix src/
