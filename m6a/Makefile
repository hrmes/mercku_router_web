all: install

install:
	make build

prd_depend: package.json package-lock.json
	npm ci

dev_depend: package.json
	npm i

dev:
	@CUSTOMER_ID=$(CUSTOMER_ID) MODEL_ID=$(MODEL_ID) IS_MVU=$(IS_MVU) npm run dev

build: prd_depend
	@CUSTOMER_ID=$(CUSTOMER_ID) MODEL_ID=$(MODEL_ID) IS_MVU=$(IS_MVU) npm run build

.PHONY: all build prd_depend dev_depend dev build
