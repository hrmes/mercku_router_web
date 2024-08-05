## mercku_router_webpages

mercku router pages, each router is in a directory.

## How to run

### for dev

- install dependencies manually in each folder
- make dev CUSTOMER_ID=xxxx MODEL_ID=xxxx
  - CUSTOMER_ID should be oneof (0001 0002 0003 0004 0029 0032)
  - MODEL_ID should be oneof (M6R0 M8 M11R1 M13R0 M16R0)

### for prd

- make CUSTOMER_ID=xxxx MODEL_ID=xxxx build
  - CUSTOMER_ID should be oneof (0001 0002 0003 0004 0029 0032 0065)
  - MODEL_ID should be oneof (M6R0 M8 M11R1 M13R0 M16R0)

test


# New Usage

## For Development

You can use new bundle tools which is 'rsbuild' in m6a now. It's dev/build/HMR speed is lighting fast.

### Prerequisite
- Nodejs Version>= 18
- **pnpm** package manager: [https://pnpm.io/motivation](https://pnpm.io/motivation), which can save your disk space and easy to manage monorepo project

> if you do not have nodejs version >=18, you can install 'nvm' first and switch to version 18. `nvm use 18`

> Enable pnpm package manager in 18. just run `corepack enable pnpm`. refer to [https://pnpm.io/installation](https://pnpm.io/installation) if encountered any installation problem

### Install Deps
This command will install all deps in root workspace and specified sub projects (currently is ./ 、 ./m6a 、 ./base)
```bash
$pnpm install
```

### Run target sub project
```bash
$MODEL_ID=xxx pnpm -F m6a rs:dev
```

Or run the project in an interactive way. This command below will guide you to choose target MODEL and CUSTOMER, and save your last choice.

```bash
$npm start
```