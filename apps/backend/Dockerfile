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

COPY --from=builder /app/out/full/ .
RUN npx turbo run build

FROM node:21-alpine
WORKDIR /app
COPY --from=installer /app/apps/backend/dist/. .
CMD ["npm", "run", "start:prod"]
