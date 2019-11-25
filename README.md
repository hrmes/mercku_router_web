# mercku_router_web

> mercku router setting

## Build step

### for development

make dev CUSTOMER_ID=xxxx

### for production

make CUSTOMER_ID=xxxx

## i18n

Run the i18n.sh script in the root directory, taking the docs branch of the latest translation file

eg:
./i18n.sh master

## 关于 CUSTOMER_ID

关于更多的 CUSTOMER_ID 信息：https://github.com/hrmes/docs/issues/660

##

## How to add a customer

1. add a folder which should be named by customer id under customer-conf
2. change default conf for customer
3. add a key for customer in src/util/constant.js
4. change menu config in src/menu.js
