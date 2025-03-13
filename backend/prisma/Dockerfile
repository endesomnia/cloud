FROM node:14
RUN openssl version -v
RUN uname -a
RUN echo $DATABASE_URL

WORKDIR /app

RUN npm install -g prisma --unsafe-perm

ADD ./ ./prisma/

CMD [ "prisma", "migrate", "up", "--experimental"]