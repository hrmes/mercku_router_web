NPM_VERSION=5.8.0

all: install

install: depend
	make build

depend: package.json package-lock.json check_npm_version
	npm ci

check_npm_version:
ifneq ($(shell npm -v),$(NPM_VERSION))
	$(error npm-v$(NPM_VERSION) required)
endif

####### For development #####################
# use these targets for development, though not so fancy
# if you are familiar with the original npm commands.
dev: package.json check_npm_version
	npm i

build: check_npm_version
	npm run build

.PHONY: all build depend check_npm_version dev build
