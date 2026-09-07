FROM php:8.2-fpm

# Install system dependencies
RUN apt-get update && apt-get install -y \
    git \
    curl \
    libcurl4-openssl-dev \
    libpq-dev \
    libssl-dev \
    zip \
    unzip \
    npm \
    pkg-config \
    && rm -rf /var/lib/apt/lists/*

# Install PHP extensions
RUN docker-php-ext-install \
    pdo_pgsql \
    curl

RUN docker-php-ext-enable pdo_pgsql

# Install Composer
COPY --from=composer:latest /usr/bin/composer /usr/bin/composer

WORKDIR /app

# Copy composer files
COPY composer.json composer.lock* ./

# Copy application code
COPY . .

# Create writable Laravel directories before Composer runs package discovery
RUN mkdir -p storage/logs storage/framework/{sessions,views,cache} bootstrap/cache && \
    chmod -R 775 storage bootstrap/cache

# Install dependencies
RUN composer install --no-dev --no-interaction

EXPOSE 8000

CMD ["php", "-S", "0.0.0.0:8000", "-t", "public"]
