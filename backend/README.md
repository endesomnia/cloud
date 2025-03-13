## Description

## Project setup

```bash
$ npm install
```

## Compile and run the project

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```


### only once

```bash
npx prisma migrate dev --name main
```

```bash
npx prisma migrate deploy
```

```bash
npx prisma migrate reset # delete all data and migration
```

### Up

1) 
```bash
mv .env.example .env
```
2)
```bash
docker compose up -d
```