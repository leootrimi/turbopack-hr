import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { json, urlencoded } from 'express';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.use(json());
  app.use(urlencoded({ extended: true }));

  app.use((req, res, next) => {
    res.header(
      'Access-Control-Allow-Origin',
      'https://turbopack-hr-web.vercel.app'
    );
    res.header(
      'Access-Control-Allow-Methods',
      'GET,POST,PUT,DELETE,OPTIONS'
    );
    res.header(
      'Access-Control-Allow-Headers',
      'Origin, X-Requested-With, Content-Type, Accept, Authorization'
    );

    if (req.method === 'OPTIONS') {
      return res.sendStatus(200);
    }

    next();
  });

  await app.listen(process.env.PORT || 3000);
}

bootstrap();