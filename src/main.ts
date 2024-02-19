import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // apply global pipe for schema validation
  app.useGlobalPipes(
    new ValidationPipe({
      dismissDefaultMessages: true,
      stopAtFirstError: true,
      whitelist: true,
    }),
  );
  await app.listen(3000);
}
bootstrap();
