import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';
import { json } from 'express';
import { NestExpressApplication } from '@nestjs/platform-express';
import { PrismaClient } from '@prisma/client';
import * as pg from 'pg';
import * as session from 'express-session';
import * as pgSessionConnect from 'connect-pg-simple';
const pgSession = pgSessionConnect(session);

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  const prisma = new PrismaClient();

  await prisma.$executeRawUnsafe(`
  CREATE TABLE IF NOT EXISTS "session" (
  "sid" varchar NOT NULL COLLATE "default",
  "sess" json NOT NULL,
  "expire" timestamp(6) NOT NULL,
  PRIMARY KEY ("sid"))
`);

  await prisma.$disconnect();

  const pgPool = new pg.Pool({
    connectionString: process.env.DATABASE_URL,
  });

  // #region Session configuratie
  //For using secure cookies in production, but allowing for testing in development
  const sessionProperties = {
    name: 'connect.apterra',
    secret: process.env.SESSION_SECRET!,
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false, maxAge: 30 * 24 * 60 * 60 * 1000 }, //30 dagen max
    proxy: true,
    store: new pgSession({ pool: pgPool }),
  };

  // if (app.get('env') === 'production') {
  //   sessionProperties.cookie.secure = true; // serve secure cookies
  // }

  //Proxy needs to be trusted for session
  app.set('trust proxy', true);

  // #endregion

  app.useGlobalPipes(new ValidationPipe());
  app.use(json({ limit: '1024mb' }), session(sessionProperties));
  const config = new DocumentBuilder()
    .setTitle('AP_Terra')
    .setDescription('AP_Terra description ')
    .setVersion('0.1')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('swagger', app, document);

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
