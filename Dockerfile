FROM hub.atomgit.com/library/node:18 AS base

RUN apt update && AWS_DEFAULT_REGION=cn-north-1 TZ=Asia/Shanghai DEBIAN_FRONTEND=noninteractive apt install -y awscli

ENV AWS_DEFAULT_REGION=cn-north-1
ENV AWS_ACCESS_KEY_ID=AKIA3KHZ6QJ2HOMF365C
ENV AWS_SECRET_ACCESS_KEY=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


RUN corepack enable
COPY package.json /app/
WORKDIR /app


RUN pnpm i
# RUN CUSTOMER_ID=0063 MODEL_ID=M8 pnpm -F m6a rs:build
EXPOSE 8080

# CMD [ "pnpm", "-F", "m6a", "rs:preview" ]