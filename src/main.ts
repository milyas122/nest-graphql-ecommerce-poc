import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);

  // apply global pipe for schema validation
  app.useGlobalPipes(
    new ValidationPipe({
      dismissDefaultMessages: true,
      stopAtFirstError: true,
      whitelist: true,
    }),
  );
  await app.listen(configService.getOrThrow('PORT'));
}
bootstrap();
