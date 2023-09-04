"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const package_json_1 = require("../../package.json");
const config_1 = require("@nestjs/config");
const types_1 = require("../../libs/types/src");
exports.default = (0, config_1.registerAs)(types_1.ConfigEnum.SWAGGER, () => ({
    title: process.env.SWAGGER_TITLE || 'Agentur NTB',
    description: process.env.SWAGGER_DESCRIPTION || "Agentur NTB Rest api's documentation",
    version: package_json_1.version || '1.0.0',
}));
//# sourceMappingURL=swaggerConfig.js.map