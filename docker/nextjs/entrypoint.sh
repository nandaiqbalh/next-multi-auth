#!/bin/sh
set -e

# run prisma migrations if DATABASE_URL is provided
if [ -n "$DATABASE_URL" ]; then
  echo "Running database migrations..."
  npx prisma migrate deploy
fi

# exec the main process (next start)
exec npm run start
