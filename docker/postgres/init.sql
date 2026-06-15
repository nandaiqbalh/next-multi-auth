-- Initialize PostgreSQL database for the application.
-- This file is executed by the official Postgres image on first startup.
-- Create extensions used by Prisma / the app.
CREATE EXTENSION IF NOT EXISTS "pgcrypto";
