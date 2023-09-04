"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const common_1 = require("@nestjs/common");
const core_1 = require("@nestjs/core");
const swagger_1 = require("@nestjs/swagger");
const app_module_1 = require("./app.module");
const config_1 = require("@nestjs/config");
const swagger_2 = require("@nestjs/swagger");
const types_1 = require("../libs/types/src");
const user_service_1 = require("./modules/user/user.service");
async function bootstrap() {
    const app = await core_1.NestFactory.create(app_module_1.AppModule);
    app.setGlobalPrefix('api');
    const logger = new common_1.Logger('Bootstrap');
    const userService = app.get(user_service_1.UserService);
    await userService.createAdmin();
    const configService = app.get(config_1.ConfigService);
    const { port: SERVER_PORT } = configService.get(types_1.ConfigEnum.SERVER);
    const swaggerConfig = configService.get(types_1.ConfigEnum.SWAGGER);
    const swaggerConfigDoc = new swagger_2.DocumentBuilder()
        .setTitle(swaggerConfig.title)
        .setDescription(swaggerConfig.description)
        .setVersion(swaggerConfig.version)
        .addBearerAuth()
        .build();
    const swaggerDocument = swagger_1.SwaggerModule.createDocument(app, swaggerConfigDoc);
    swagger_1.SwaggerModule.setup('api', app, swaggerDocument);
    app.useGlobalPipes(new common_1.ValidationPipe());
    app.enableCors();
    await app.listen(SERVER_PORT);
    logger.log(`Server is running on: ${await app.getUrl()}`);
}
bootstrap();
//# sourceMappingURL=main.js.map