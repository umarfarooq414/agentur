"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const types_1 = require("../../libs/types/src");
const config_1 = require("@nestjs/config");
exports.default = (0, config_1.registerAs)(types_1.ConfigEnum.JWT_TOKEN, () => ({
    secret: process.env.JWT_SECRET || 'thisshouldbeasecret',
    expireIn: process.env.JWT_EXPIRES || '365d',
}));
//# sourceMappingURL=jwtConfig.js.map