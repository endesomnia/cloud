## Cloud Storage - JulCloud

### how to start

### required

- docker instaled

#### Start command

##### basic up

```bash
docker compose up -d
```

###### stop command

```bash
docker compose down
```


##### start with build image for uniq platform, macos or linux for example

```bash
docker compose -f docker-compose.build.yml up -d
```

###### stop command

```bash
docker compose -f docker-compose.build.yml down
```
