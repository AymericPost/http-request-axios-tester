FROM node:lts-alpine as build-stage
WORKDIR /app
COPY .babelrc /app/.babelrc
COPY *.json /app/

RUN npm install

COPY src /app/src
RUN npm run build

CMD npm start
