"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const types_1 = require("../../libs/types/src");
const config_1 = require("@nestjs/config");
exports.default = (0, config_1.registerAs)(types_1.ConfigEnum.SERVER, () => ({
    port: parseInt(process.env.BACKEND_APP_PORT) || 5500,
    productName: process.env.PRODUCT_NAME,
    frontendUrl: process.env.FRONTEND_URL,
    supportEmail: process.env.SUPPORT_EMAIL,
    authOtpVerificationLink: process.env.AUTH_OTP_VERIFICATION_LINK,
    authLoginLink: process.env.AUTH_LOGIN_LINK,
    admin: {
        userName: process.env.ADMIN_USERNAME || 'admin',
        email: process.env.ADMIN_EMAIL || 'admin@example.com',
        firstName: process.env.ADMIN_FIRST_NAME || 'Super',
        lastName: process.env.ADMIN_LAST_NAME || 'Admin',
        password: process.env.ADMIN_PASSWORD || 'adminPassword',
    },
    support2: {
        userName: process.env.SUPPORT2_USERNAME || 'ad',
        email: process.env.SUPPORT2_EMAIL || 'admin@example.com',
        firstName: process.env.SUPPORT2_FIRST_NAME || 'Super',
        lastName: process.env.SUPPORT2_LAST_NAME || 'admin',
        password: process.env.SUPPORT2_PASSWORD || 'adminPassword',
    },
}));
//# sourceMappingURL=serverConfig.js.map