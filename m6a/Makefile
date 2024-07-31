all: install

install:
	make build

prd_depend: package.json package-lock.json
	npm ci

dev_depend: package.json
	npm i

dev:
	NODE_OPTIONS=--openssl-legacy-provider CUSTOMER_ID=$(CUSTOMER_ID) MODEL_ID=$(MODEL_ID) npm run dev

build: prd_depend
	@CUSTOMER_ID=$(CUSTOMER_ID) MODEL_ID=$(MODEL_ID) npm run build

.PHONY: all build prd_depend dev_depend dev build
