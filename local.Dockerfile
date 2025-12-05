ARG IMAGE=node:24.11.1-slim

FROM ${IMAGE} AS build

# делаем каталог 'app' текущим рабочим каталогом
WORKDIR /usr/src/app

# Копируем только package.json и yarn.lock для более эффективного кэширования
COPY package.json ./ yarn.lock ./

# устанавливаем зависимости проекта
RUN yarn install --frozen-lockfile

# копируем исходники
COPY . .

# собираем приложение
RUN yarn run build

FROM ${IMAGE} AS runner

RUN apt-get -y update \
    && apt-get -y upgrade \
    && apt-get -y install mc \
    && apt-get -y install curl

WORKDIR /usr/src/app

COPY package.json ./ yarn.lock ./

RUN yarn install --production=true

COPY --from=build /usr/src/app/dist ./dist
COPY ecosystem.config.js /usr/src/app

# команда для запуска отдельного докер образа
CMD [ "node", "dist/src/main.js" ]
# команда для запуска отдельного докер образа (через pm2)
#CMD [ "pm2-runtime", "start", "ecosystem.config.js" ]

# открываем порт
EXPOSE 3000

