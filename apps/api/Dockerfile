FROM node:20

# Enable pnpm
RUN corepack enable && corepack prepare pnpm@latest --activate

WORKDIR /app

COPY pnpm-workspace.yaml ./
COPY pnpm-lock.yaml ./
COPY package.json ./
COPY turbo.json ./

COPY packages ./packages

COPY apps/api ./apps/api

RUN pnpm install

RUN pnpm --filter api build

WORKDIR /app/apps/api

EXPOSE 3000
CMD ["node", "dist/main"]
