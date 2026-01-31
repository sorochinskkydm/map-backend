ARG IMAGE=node:24.11.1-slim

FROM ${IMAGE} AS build

# Устанавливаем рабочую директорию
WORKDIR /usr/src/app

# Копируем только package.json и yarn.lock для более эффективного кэширования
COPY package.json yarn.lock .yarnrc.yml .yarn/ ./

# устанавливаем зависимости проекта
RUN corepack enable && yarn install --immutable

# копируем исходники
COPY . .

# собираем приложение
RUN yarn run build # --verbose

# этап production (production-stage)
FROM ${IMAGE} AS runner

# Создаем APPUSER и группу для безопасности
RUN groupadd -g 1001 appgroup \
    && useradd -u 1001 -g 1001 --create-home --shell /bin/bash appuser

RUN apt-get update \
    && apt-get install -y --no-install-recommends ca-certificates \
    && apt-get clean \
    && rm -rf /var/lib/apt/lists/* \
    && npm install -g pm2 \
    && pm2 install pm2-logrotate

# Устанавливаем рабочую директорию
WORKDIR /usr/src/app

COPY package.json yarn.lock .yarnrc.yml .yarn/ ./

RUN corepack enable && yarn install --immutable
RUN yarn workspaces focus --production --all


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