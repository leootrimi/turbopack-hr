FROM node:20-alpine

RUN apk add --no-cache libc6-compat python3 make g++ && corepack enable

WORKDIR /app

COPY pnpm-workspace.yaml ./
COPY pnpm-lock.yaml ./
COPY package.json ./
COPY turbo.json ./

COPY packages ./packages
COPY apps/web ./apps/web

RUN pnpm install

RUN pnpm build

WORKDIR /app/apps/web

EXPOSE 3001

CMD ["pnpm", "start"]
