MIN_NPM_VER_MAJOR=6
MIN_NPM_VER_MINOR=1
MIN_NPM_VER_PATCH=0

CUR_NPM_VER := $(shell npm -v)
CUR_NPM_VER_MAJOR := $(shell echo $(CUR_NPM_VER) | cut -f1 -d.)
CUR_NPM_VER_MINOR := $(shell echo $(CUR_NPM_VER) | cut -f2 -d.)
CUR_NPM_VER_PATCH := $(shell echo $(CUR_NPM_VER) | cut -f3 -d.)
IS_NPM_OK := $(shell [ $(CUR_NPM_VER_MAJOR) -gt $(MIN_NPM_VER_MAJOR) -o \( $(CUR_NPM_VER_MAJOR) -eq $(MIN_NPM_VER_MAJOR) -a \( $(CUR_NPM_VER_MINOR) -gt $(MIN_NPM_VER_MINOR) -o \( $(CUR_NPM_VER_MINOR) -eq $(MIN_NPM_VER_MINOR) -a $(CUR_NPM_VER_PATCH) -ge $(MIN_NPM_VER_PATCH) \)  \) \) ] && echo true)

CUSTOMER_LIST = 0001
MODEL_LIST = M6R0=m6 M8=m6a M11R1=m6s M11R2=m6s M11R4=m6s M13R0=nano M16R0=m6s_poe GA630=ga630

# Legacy per-model builds require CUSTOMER_ID and MODEL_ID. The unified
# build (build_unified/dev_unified) does NOT - identity is runtime-only.
# Guard checks are in the legacy recipes so unified targets can run freely.

all: install

install:
	make build

check_npm_version:
ifneq ($(IS_NPM_OK),true)
	$(error npm-v$(MIN_NPM_VER_MAJOR).$(MIN_NPM_VER_MINOR).$(MIN_NPM_VER_PATCH)+ required)
endif

prd_depend: package.json package-lock.json check_npm_version
	npm ci

dev_depend: package.json check_npm_version
	npm i

# Legacy per-model build. Requires CUSTOMER_ID and MODEL_ID.
build: prd_depend
ifndef CUSTOMER_ID
	$(error CUSTOMER_ID required)
endif
ifeq ($(shell echo $(CUSTOMER_LIST) | grep $(CUSTOMER_ID)),)
	$(error CUSTOMER_ID should be oneof ($(CUSTOMER_LIST)))
endif
ifndef MODEL_ID
	$(error MODEL_ID required)
endif
ifeq ($(shell echo $(MODEL_LIST) | grep $(MODEL_ID)),)
	$(error MODEL_ID should be oneof ($(MODEL_LIST)))
endif
	MODEL=$$(echo $(MODEL_LIST) | tr ' ' '\n' | grep '^$(MODEL_ID)=' | cut -d= -f2); \
	cd $$MODEL && make CUSTOMER=$(CUSTOMER_ID) MODEL_ID=$(MODEL_ID)
	MODEL=$$(echo $(MODEL_LIST) | tr ' ' '\n' | grep '^$(MODEL_ID)=' | cut -d= -f2); \
	ln -sfn $$MODEL/dist dist

# Legacy per-model dev server. Requires CUSTOMER_ID and MODEL_ID.
dev: dev_depend
ifndef CUSTOMER_ID
	$(error CUSTOMER_ID required)
endif
ifndef MODEL_ID
	$(error MODEL_ID required)
endif
	MODEL=$$(echo $(MODEL_LIST) | tr ' ' '\n' | grep '^$(MODEL_ID)=' | cut -d= -f2); \
	cd $$MODEL && make dev CUSTOMER=$(CUSTOMER_ID) MODEL_ID=$(MODEL_ID)

# Unified profile-driven build (Task 10). Produces a single dist-unified/
# directory shared by all device/customer installs. Does NOT take
# CUSTOMER_ID or MODEL_ID - identity is provided at runtime via
# runtime-config.v1.json. Requires Node 17+ with --openssl-legacy-provider
# for webpack 4 compatibility.
build_unified: prd_depend
	NODE_OPTIONS=--openssl-legacy-provider npm run build:unified
	node scripts/hash-web-dist.mjs dist-unified

dev_unified: dev_depend
	NODE_OPTIONS=--openssl-legacy-provider npm run dev:unified


.PHONY: all install check_npm_version prd_depend dev_depend dev build build_unified dev_unified
