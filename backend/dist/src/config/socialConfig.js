"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const types_1 = require("../../libs/types/src");
const config_1 = require("@nestjs/config");
exports.default = (0, config_1.registerAs)(types_1.ConfigEnum.SOCIAL, () => ({
    GOOGLE_APP_ID: process.env.GOOGLE_CLIENT_ID,
    GOOGLE_APP_SECRET: process.env.GOOGLE_CLIENT_SECRET,
    FACEBOOK_APP_ID: process.env.FACEBOOK_CLIENT_ID,
    FACEBOOK_APP_SECRET: process.env.FACEBOOK_CLIENT_SECRET,
}));
//# sourceMappingURL=socialConfig.js.map