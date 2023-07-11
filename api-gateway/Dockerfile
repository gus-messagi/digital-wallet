FROM node:16.20.0
RUN mkdir -p /app/gateway
WORKDIR /app/gateway
ADD . /app/gateway

RUN npm install -g protoc

RUN yarn install
RUN yarn proto:wallet && yarn proto:statement && yarn proto:auth

CMD yarn run build && yarn run start:prod