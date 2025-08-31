#!/bin/bash
# wait-for-services.sh

set -e

# Wait for PostgreSQL
until PGPASSWORD=$POSTGRES_PASSWORD psql -h "db" -U "$POSTGRES_USER" -c '\q'; do
  >&2 echo "Postgres is unavailable - sleeping"
  sleep 1
done

>&2 echo "Postgres is up"

# Wait for Redis
until redis-cli -h "redis" ping; do
  >&2 echo "Redis is unavailable - sleeping"
  sleep 1
done

>&2 echo "Redis is up - executing command"

# Execute the command
exec "$@"
