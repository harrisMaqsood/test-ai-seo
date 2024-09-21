import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';
import { setFfmpegPath } from 'fluent-ffmpeg';
import { path } from '@ffmpeg-installer/ffmpeg';
import { AllExceptionsFilter } from './filters/all-exceptions.filter';

setFfmpegPath(path);
async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const config = new DocumentBuilder()
    .setTitle('Video Converter API')
    .setDescription(
      'API to manage video formats, download, and convert videos from youtube',
    )
    .setVersion('1.0')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document);

  app.useGlobalPipes(new ValidationPipe());

  app.useGlobalFilters(new AllExceptionsFilter());

  await app.listen(3000);
}
bootstrap();
