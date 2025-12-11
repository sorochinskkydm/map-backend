ARG IMAGE=node:24.11.1-slim

FROM ${IMAGE} AS build

# Устанавливаем рабочую директорию
WORKDIR /usr/src/app

# Копируем только package.json и yarn.lock для более эффективного кэширования
COPY package.json ./ yarn.lock ./

# устанавливаем зависимости проекта
RUN yarn install --frozen-lockfile

# копируем исходники
COPY . .

# собираем приложение
RUN yarn run build # --verbose

# этап production (production-stage)
FROM ${IMAGE} AS runner

# Создаем non-root пользователя для безопасности
RUN useradd --create-home --shell /bin/bash appuser \
    && apt-get update \
    && apt-get install -y --no-install-recommends ca-certificates \
    && apt-get clean \
    && rm -rf /var/lib/apt/lists/* \
    && npm install -g pm2 \
    && pm2 install pm2-logrotate

# Устанавливаем рабочую директорию
WORKDIR /usr/src/app

COPY package.json ./ yarn.lock ./

RUN yarn install --production=true --frozen-lockfile

COPY --from=build /usr/src/app/dist ./dist
COPY --chown=appuser:appuser ecosystem.config.js ./

# Переключаемся на non-root пользователя
USER appuser

# команда для запуска отдельного докер образа
#CMD [ "node", "dist/main.js" ]
# команда для запуска отдельного докер образа (через pm2)
#CMD [ "pm2-runtime", "start", "ecosystem.config.js" ]

# открываем порт
EXPOSE 3000