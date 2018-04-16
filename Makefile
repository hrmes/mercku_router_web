NPM_VERSION=5.8.0

all: build

build: depend
	npm run build

depend: package.json package-lock.json
	npm ci

check_npm_version:
ifneq ($(shell npm -v),$(NPM_VERSION))
	$(error npm-v$(NPM_VERSION) required)
endif

.PHONY: all build depend check_npm_version
