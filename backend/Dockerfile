FROM node:23

WORKDIR /usr/src/app

COPY . ./

RUN npm install && \
    npm run build

EXPOSE 3000


CMD ["npm", "run", "start:migrate:prod"]
