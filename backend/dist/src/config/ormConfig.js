"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const path_1 = require("path");
const config_1 = require("@nestjs/config");
const types_1 = require("../../libs/types/src");
const ENTITIES_DIR = (0, path_1.resolve)(__dirname, '../', '**', 'entities', '*.entity.{ts,js}');
exports.default = (0, config_1.registerAs)(types_1.ConfigEnum.TYPEORM, () => ({
    type: 'mysql',
    host: process.env.DB_HOST || 'localhost',
    port: +process.env.DB_PORT || 3306,
    username: process.env.DB_USERNAME || 'root',
    password: process.env.DB_PASSWORD || 'password',
    database: process.env.DB_NAME || 'agentur',
    synchronize: true,
    entities: [ENTITIES_DIR],
    dropSchema: false,
}));
//# sourceMappingURL=ormConfig.js.map