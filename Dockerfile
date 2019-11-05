FROM node:12.12
WORKDIR /usr/src/app
COPY package.json yarn.lock ./
RUN yarn install
COPY . .
CMD yarn test