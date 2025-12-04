# NNMAP.SERVICE

## Installation

```bash
$ npm install
```

## Running the app

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## Migrations

### Generate migration

```bash
$  npm run migrations:generate --name=create-application-type
```

### Run migrations

```bash
$ npm run migrations:run
```

### Undo migration

```bash
$ npm run migrations:revert
```

## Переменные CI/CD

| **Parameter Name**  | **Description**                             |
| ------------------- | ------------------------------------------- |
| `DB_HOST`           | Адрес базы данных                           |
| `DB_PORT`           | Порт базы данных                            |
| `DB_LOGIN`          | Логин для подключения к базе данных         |
| `DB_PASSWORD`       | Пароль для подключения к базе данных        |
| `DB_NAME`           | Название базы данных                        |
| `SWAGGER_LOGIN`     | Логин для доступа к документации в Swagger  |
| `SWAGGER_PASSWORD`  | Пароль для доступа к документации в Swagger |
| `SWAGGER_PATH`      | Путь документации Swagger                   |
| `SCALAR_PATH`       | Путь документации Scalar                    |
| `GLOBAL_API_PREFIX` | Префикс документации Swagger                |
| `SERVER_PORT`       | Порт сервера                                |
