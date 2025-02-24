import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ConfigService } from '@nestjs/config';
import * as cookieParser from 'cookie-parser';
async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const config = app.get(ConfigService);
  const configSwagger = new DocumentBuilder()
    .setTitle('Currency converter API')
    .setDescription('Currency converter API description')
    .setVersion('1.0')
    .addTag('Currency converter')
    .addBearerAuth(
      {
        type: 'apiKey',
        in: 'cookie',
        name: 'Authorization',
      },
      'Authorization',
    )
    .build();
  const documentFactory = () =>
    SwaggerModule.createDocument(app, configSwagger);
  SwaggerModule.setup('docs', app, documentFactory);
  app.setGlobalPrefix('api');
  app.use(cookieParser());
  await app.listen(config.get('PORT') ?? 3000);
}
bootstrap();
