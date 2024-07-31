FROM node:18 AS base

ENV MODEL_ID=M16R0\
    CUSTOMER_ID=0001

RUN corepack enable
COPY . /app
WORKDIR /app


RUN git --version

RUN pnpm i
RUN pnpm -F m6a rs:build
EXPOSE 8080

CMD [ "pnpm", "-F", "m6a", "rs:preview" ]