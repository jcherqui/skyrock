.PHONY: build

install: ## Install dependencies
	npm i

build: ## Build with babel
	@ mkdir -p build
	@ ./node_modules/.bin/babel src/ --out-dir build/ --compact true
	@ chmod +x build/index.js

run: ## Run with babel
	@ ./node_modules/.bin/babel-node src/index.js

