"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const types_1 = require("../../libs/types/src");
const config_1 = require("@nestjs/config");
exports.default = (0, config_1.registerAs)(types_1.ConfigEnum.MAIL, () => ({
    MAIL_HOST: process.env.MAIL_HOST,
    MAIL_USER: process.env.MAIL_USER,
    MAIL_PASSWORD: process.env.MAIL_PASSWORD,
    MAIL_FROM: process.env.MAIL_FROM,
}));
//# sourceMappingURL=mailConfig.js.map