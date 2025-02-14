FROM node:21 AS builder

WORKDIR /build

COPY . .

RUN npm install -D
RUN npm run build

FROM nginx:1.27.0-alpine

COPY --from=builder /build/dist/frontend/. /usr/share/nginx/html/
