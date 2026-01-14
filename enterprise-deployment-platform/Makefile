.PHONY: help install dev build start test lint docker-build docker-run docker-stop clean

help: ## Show this help message
	@echo 'Usage: make [target]'
	@echo ''
	@echo 'Available targets:'
	@awk 'BEGIN {FS = ":.*?## "} /^[a-zA-Z_-]+:.*?## / {printf "  %-15s %s\n", $$1, $$2}' $(MAKEFILE_LIST)

install: ## Install dependencies
	npm ci

dev: ## Start development server
	npm run dev

build: ## Build for production
	npm run build

start: ## Start production server
	npm start

test: ## Run tests
	npm test

test-coverage: ## Run tests with coverage
	npm run test:coverage

lint: ## Run linter
	npm run lint

type-check: ## Run TypeScript type check
	npm run type-check

docker-build: ## Build Docker image
	docker build -t enterprise-platform .

docker-run: ## Run Docker container
	docker-compose up -d

docker-stop: ## Stop Docker container
	docker-compose down

docker-logs: ## View Docker logs
	docker-compose logs -f

clean: ## Clean build artifacts
	rm -rf .next
	rm -rf node_modules
	rm -rf coverage
	rm -rf .vercel

deploy-staging: ## Deploy to staging
	vercel --prod=false

deploy-production: ## Deploy to production
	vercel --prod

analyze: ## Analyze bundle size
	ANALYZE=true npm run build

