FROM node:16-alpine3.12 as build
RUN apk add --no-cache git

WORKDIR /app
COPY package.json yarn.lock ./
COPY . .
RUN yarn install
RUN yarn build

FROM node:16-alpine3.12 as final
RUN apk add --no-cache git

WORKDIR /app
COPY --from=build /app/package.json /app/yarn.lock ./
COPY --from=build /app/dist ./dist

RUN yarn install --only=production

ENTRYPOINT [ "yarn", "start:prod" ]