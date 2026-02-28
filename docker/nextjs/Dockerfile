# multi-stage build for Next.js project
# https://nextjs.org/docs/deployment#docker-image

FROM node:20-alpine AS builder
WORKDIR /app

# install dependencies
COPY package.json package-lock.json ./
RUN npm ci
# ensure OpenSSL is available for Prisma during generation/build
RUN apk add --no-cache openssl tzdata
# set server timezone to WIB (Asia/Jakarta)
ENV TZ=Asia/Jakarta

# copy rest of the source code and build
COPY . ./
# generate the Prisma client before building
RUN npx prisma generate
RUN npm run build

# production image
FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
# set timezone to WIB
ENV TZ=Asia/Jakarta

# ensure OpenSSL is installed for runtime Prisma commands
RUN apk add --no-cache openssl tzdata

# copy only the necessary files from the builder stage
COPY --from=builder /app/package.json ./
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/next.config.mjs ./
COPY --from=builder /app/next.config.js ./
# include Prisma schema for migrations
COPY --from=builder /app/prisma ./prisma
# entrypoint was placed in docker/nextjs; builder context is project root
COPY --from=builder /app/docker/nextjs/entrypoint.sh ./

EXPOSE 3000

ENTRYPOINT ["./entrypoint.sh"]
