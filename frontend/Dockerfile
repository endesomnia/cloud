FROM node:23

WORKDIR /app

COPY package.json yarn.lock ./
RUN corepack enable yarn && yarn install --network-timeout 1000000

COPY . .

EXPOSE 3030

CMD ["yarn", "dev"]
