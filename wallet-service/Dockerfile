FROM node:16.20.0
RUN mkdir -p /app/wallet-service
WORKDIR /app/wallet-service
ADD . /app/wallet-service

RUN npm install -g protoc

RUN yarn install
RUN yarn proto:wallet

CMD yarn run build && yarn run start:prod