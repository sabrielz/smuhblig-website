# syntax=docker/dockerfile:1

ARG PHP_VERSION=8.4

# ---------------------------------------------------------------------------
# Tahap 1: builder (Composer & Node/Vite Build)
# ---------------------------------------------------------------------------
FROM dunglas/frankenphp:php${PHP_VERSION}-alpine AS builder

WORKDIR /app

RUN apk add --no-cache nodejs npm

RUN install-php-extensions \
    pdo_mysql \
    bcmath \
    intl \
    gd \
    exif \
    pcntl \
    zip \
    redis \
    opcache

COPY --from=composer:2 /usr/bin/composer /usr/bin/composer

# Lapisan dependensi PHP (di-cache selama composer.* tidak berubah)
COPY composer.json composer.lock ./
RUN composer install \
    --no-dev \
    --no-interaction \
    --prefer-dist \
    --no-scripts \
    --no-autoloader

# Lapisan dependensi Node
COPY package.json package-lock.json* ./
RUN npm ci

# Salin seluruh kode aplikasi
COPY . .

RUN mkdir -p \
    storage/framework/cache \
    storage/framework/sessions \
    storage/framework/views \
    storage/logs \
    storage/app/public \
    storage/app/private \
    bootstrap/cache

# Dump autoloader optimal
RUN composer dump-autoload --no-dev --optimize --no-interaction

# Build frontend & SSR bundle
RUN npm run build \
    && rm -rf node_modules


# ---------------------------------------------------------------------------
# Tahap 2: image produksi final
# ---------------------------------------------------------------------------
FROM dunglas/frankenphp:php${PHP_VERSION}-alpine

WORKDIR /app

ENV TZ=Asia/Jakarta \
    XDG_DATA_HOME=/data \
    XDG_CONFIG_HOME=/config

RUN apk add --no-cache tzdata mariadb-client

RUN install-php-extensions \
    pdo_mysql \
    bcmath \
    intl \
    gd \
    exif \
    pcntl \
    zip \
    redis \
    opcache

RUN cp "$PHP_INI_DIR/php.ini-production" "$PHP_INI_DIR/php.ini"
COPY docker/production/php.ini $PHP_INI_DIR/conf.d/99-smkmuhbligo.ini
COPY docker/production/Caddyfile /etc/caddy/Caddyfile
COPY docker/production/entrypoint.sh /usr/local/bin/entrypoint.sh

RUN addgroup -g 1000 -S appgroup \
    && adduser -u 1000 -S -G appgroup appuser \
    && chmod +x /usr/local/bin/entrypoint.sh \
    && mkdir -p /data /config /backups \
    && chown -R appuser:appgroup /data /config /backups

COPY --from=builder --chown=appuser:appgroup /app /app

RUN mkdir -p \
    storage/app/public \
    storage/app/private \
    storage/framework/cache \
    storage/framework/sessions \
    storage/framework/views \
    storage/logs \
    bootstrap/cache \
    && chown -R appuser:appgroup storage bootstrap/cache \
    && chmod -R ug+rwX storage bootstrap/cache

USER appuser

HEALTHCHECK NONE

EXPOSE 8000

ENTRYPOINT ["/usr/local/bin/entrypoint.sh"]
CMD ["frankenphp", "run", "--config", "/etc/caddy/Caddyfile", "--adapter", "caddyfile"]
