import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ExpressAdapter } from '@nestjs/platform-express';
import * as express from 'express';
import * as cors from 'cors';

let expressApp: express.Express | null = null;

async function createNestApp() {
  if (expressApp) return expressApp;

  const app = await NestFactory.create(AppModule, new ExpressAdapter());

  // Apply CORS middleware
  app.use(
    cors({
      origin: [
        'https://turbopack-hr-web.vercel.app',
        'https://turbopack-hr-web-skas.vercel.app',
      ],
      methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
      allowedHeaders: ['Content-Type', 'Authorization'],
      credentials: true,
    })
  );

  // Handle OPTIONS preflight
  app.use((req, res, next) => {
    if (req.method === 'OPTIONS') {
      res.status(204).end();
      return;
    }
    next();
  });

  await app.init();

  expressApp = app.getHttpAdapter().getInstance();
  return expressApp;
}

export default async function handler(req: any, res: any) {
  const app = await createNestApp();
  app!(req, res); 
}