FROM node:21-alpine AS base

FROM base AS builder
RUN apk update
RUN apk add --no-cache libc6-compat

WORKDIR /app
RUN npm install --global turbo@^2.4.2
COPY . .

RUN turbo prune frontend --docker

FROM base AS installer
RUN apk update
RUN apk add --no-cache libc6-compat
WORKDIR /app
RUN npm install --global turbo@^2.4.2

COPY --from=builder /app/out/json .
RUN npm install --frozen-lockfile --force

COPY --from=builder /app/out/full/ .
RUN npx turbo run build

FROM nginx:1.27.0-alpine

COPY --from=installer /app/apps/frontend/dist/frontend/browser/. /usr/share/nginx/html/
