import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import * as dotenv from 'dotenv';
dotenv.config();

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const config = new DocumentBuilder()
    .setTitle('URL Shortener API')
    .setDescription('API para gerenciamento de URLs encurtadas')
    .setVersion('1.0')
    .addBearerAuth() // Adiciona suporte para autenticação JWT
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('apidocs', app, document);

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
