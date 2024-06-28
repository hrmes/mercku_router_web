MIN_NPM_VER_MAJOR=6
MIN_NPM_VER_MINOR=1
MIN_NPM_VER_PATCH=0

include config

CUR_NPM_VER := $(shell npm -v)
CUR_NPM_VER_MAJOR := $(shell echo $(CUR_NPM_VER) | cut -f1 -d.)
CUR_NPM_VER_MINOR := $(shell echo $(CUR_NPM_VER) | cut -f2 -d.)
CUR_NPM_VER_PATCH := $(shell echo $(CUR_NPM_VER) | cut -f3 -d.)
IS_NPM_OK := $(shell [ $(CUR_NPM_VER_MAJOR) -gt $(MIN_NPM_VER_MAJOR) -o \( $(CUR_NPM_VER_MAJOR) -eq $(MIN_NPM_VER_MAJOR) -a \( $(CUR_NPM_VER_MINOR) -gt $(MIN_NPM_VER_MINOR) -o \( $(CUR_NPM_VER_MINOR) -eq $(MIN_NPM_VER_MINOR) -a $(CUR_NPM_VER_PATCH) -ge $(MIN_NPM_VER_PATCH) \)  \) \) ] && echo true)

CUSTOMER_LIST = 0001 0002 0003 0004 0029 0032
MODEL_LIST = M6R0=m6 M8=m6a M11R1=m6s M13R0=nano M16R0=m6s_poe

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

MODEL=$(subst $(MODEL_ID)=,,$(filter $(MODEL_ID)=%, $(MODEL_LIST)))

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

build: prd_depend
	make -C $(MODEL) CUSTOMER=$(CUSTOMER_ID) MODEL_ID=$(MODEL_ID)
	mkdir -p output
	tar cf output/webui-$(VERSION)-$(CUSTOMER_ID)-$(MODEL_ID).tar -C $(MODEL) dist

dev:
	make -C $(MODEL) dev CUSTOMER=$(CUSTOMER_ID) MODEL_ID=$(MODEL_ID)

.PHONY: all install check_npm_version prd_depend dev_depend dev build
