FROM node:9.2.0-alpine

RUN apk add --update \
  git \
  bash

COPY . /src
WORKDIR /src

RUN npm install
CMD npm run start
