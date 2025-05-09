import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import * as cookieParse from 'cookie-parser';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(new ValidationPipe({
    whitelist: true, 
    forbidNonWhitelisted: true, 
    transform: true, 
  }));

  app.enableCors({
    origin: 'http://localhost:5173',
    credentials: true, 
  });

  app.use(cookieParse());

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
