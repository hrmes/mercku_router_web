FROM hub.atomgit.com/library/node:18 AS base

RUN corepack enable
COPY package.json /app/
WORKDIR /app


RUN pnpm i
# RUN CUSTOMER_ID=0063 MODEL_ID=M8 pnpm -F m6a rs:build
EXPOSE 8080

# CMD [ "pnpm", "-F", "m6a", "rs:preview" ]