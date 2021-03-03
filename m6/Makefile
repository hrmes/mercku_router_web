all: install

install:
	make build

prd_depend: package.json package-lock.json check_npm_version
	npm ci

dev_depend: package.json check_npm_version
	npm i

dev:
	@CUSTOMER_ID=$(CUSTOMER_ID) npm run dev

build: prd_depend
	@CUSTOMER_ID=$(CUSTOMER_ID) npm run build

.PHONY: all build prd_depend dev_depend dev build
