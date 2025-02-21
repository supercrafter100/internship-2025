FROM node:21-alpine AS base

FROM base AS builder
RUN apk update
RUN apk add --no-cache libc6-compat

WORKDIR /app
RUN npm install --global turbo@^2.4.2
COPY . .

RUN turbo prune backend --docker

FROM base AS installer
RUN apk update 
RUN apk add --no-cache libc6-compat
WORKDIR /app
RUN npm install --global turbo@^2.4.2

COPY --from=builder /app/out/json .
RUN npm install --frozen-lockfile
RUN npm install tslib
RUN npx prisma generate

COPY --from=builder /app/out/full/ .
RUN npx turbo run build

# For some reason this isn't getting installed??

FROM node:21-alpine
WORKDIR /app
COPY --from=installer /app .


CMD node apps/backend/dist/src/main.js
