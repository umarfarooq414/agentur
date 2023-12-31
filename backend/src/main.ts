/* eslint-disable prettier/prettier */
import { ValidationPipe, Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { DocumentBuilder } from '@nestjs/swagger';
import { ConfigEnum, IServerConfig, ISwaggerConfig } from '@lib/types';
import { UserService } from './modules/user/user.service';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix('api');
  // app.enableCors(options);
  // app.use(cors({ origin: 'portal.agentur-ntb.de' }));
  const logger = new Logger('Bootstrap');

  const userService = app.get<UserService>(UserService);
  await userService.createAdmin();

  const configService = app.get<ConfigService>(ConfigService);

  const { port: SERVER_PORT } = configService.get<IServerConfig>(
    ConfigEnum.SERVER,
  );

  const swaggerConfig = configService.get<ISwaggerConfig>(ConfigEnum.SWAGGER);

  // swagger configuration
  const swaggerConfigDoc = new DocumentBuilder()
    .setTitle(swaggerConfig.title)
    .setDescription(swaggerConfig.description)
    .setVersion(swaggerConfig.version)
    .addBearerAuth()
    .build();

  const swaggerDocument = SwaggerModule.createDocument(app, swaggerConfigDoc);
  SwaggerModule.setup('api', app, swaggerDocument);

  app.useGlobalPipes(new ValidationPipe());
  app.enableCors();
  await app.listen(SERVER_PORT);
  logger.log(`Server is running on: ${await app.getUrl()}`);
}
bootstrap();
