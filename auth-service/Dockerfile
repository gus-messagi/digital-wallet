FROM node:16.20.0
RUN mkdir -p /app/auth-service
WORKDIR /app/auth-service
ADD . /app/auth-service

RUN npm install -g protoc

RUN yarn install
RUN yarn proto:auth

RUN yarn prisma generate
RUN yarn db:migrate

CMD yarn run build && yarn run start:prod