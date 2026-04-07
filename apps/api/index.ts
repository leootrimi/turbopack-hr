import { NestFactory } from '@nestjs/core';
import { ExpressAdapter } from '@nestjs/platform-express';
import express from 'express';
import cors from 'cors';
import { AppModule } from './src/app.module';

const server = express();

// ✅ apply CORS at express level
server.use(cors({
  origin: 'https://turbopack-hr-web-skas.vercel.app',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
}));

let app;

async function bootstrap() {
  if (!app) {
    app = await NestFactory.create(
      AppModule,
      new ExpressAdapter(server),
    );
    await app.init();
  }
  return server;
}

export default async function handler(req, res) {
  const appServer = await bootstrap();

  if (req.method === 'OPTIONS') {
    return res.status(200).end(); // ✅ handle preflight
  }

  return appServer(req, res);
}