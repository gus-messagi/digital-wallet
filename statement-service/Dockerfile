FROM node:16.20.0
RUN mkdir -p /app/statement-service
WORKDIR /app/statement-service
ADD . /app/statement-service

RUN npm install -g protoc

RUN yarn install
RUN yarn proto:wallet && yarn proto:statement && yarn proto:auth

EXPOSE 50053

CMD yarn run build && yarn run start:prod