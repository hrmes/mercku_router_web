## mercku_router_webpages

mercku router pages, each router is in a directory.

## 进入编译环境
```shell
./docker/build.sh
./docker/linux_start
```

## How to run

### for dev

- install dependencies manually in each folder
- make dev CUSTOMER_ID=xxxx MODEL_ID=xxxx
  - CUSTOMER_ID should be oneof (0001 0002 0003 0004 0005 0006 0007 0013 0014 0019 0025)
  - MODEL_ID should be oneof (M2R2 M6R0 M7R0 M8R0 M8 M9R0 M9R1 M9R2)

### for prd

- make CUSTOMER_ID=xxxx MODEL_ID=xxxx
  - CUSTOMER_ID should be oneof (0001 0002 0003 0004 0005 0006 0007 0013 0014 0019 0025)
  - MODEL_ID should be oneof (M2R2 M6R0 M7R0 M8R0 M8 M9R0 M9R1 M9R2)

test
