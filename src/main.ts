import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import * as cookieParse from 'cookie-parser';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(new ValidationPipe({
    whitelist: true, // Elimina campos que no estén en el DTO
    forbidNonWhitelisted: true, // Lanza error si hay campos no permitidos
    transform: true, // Para convertir tipos automáticamente
  }));

  app.use(cookieParse());

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
