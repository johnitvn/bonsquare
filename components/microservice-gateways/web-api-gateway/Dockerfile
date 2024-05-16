FROM node:20-alpine

RUN apk add --no-cache dumb-init

COPY dist/components/microservice-gateways/web-api-gateway/ncc /usr/app/

WORKDIR /usr/app
ENTRYPOINT ["dumb-init", "--"]
CMD ["node","index.js"]
