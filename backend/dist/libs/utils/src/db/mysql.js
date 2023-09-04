"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UuidTransformer = void 0;
const typeorm_1 = require("typeorm");
const utils_1 = require("..");
exports.UuidTransformer = {
    to: (value) => {
        const uuid = value === null || value === void 0 ? void 0 : value.uuid;
        if (uuid)
            return uuid;
        if (typeof value === 'string')
            return value;
        const operator = value;
        return (0, typeorm_1.In)(operator.value.map((v) => v.uuid));
    },
    from: (value) => new utils_1.Uuid(value),
};
//# sourceMappingURL=mysql.js.map