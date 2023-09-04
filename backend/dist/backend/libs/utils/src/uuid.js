"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Uuid = void 0;
const uuid = require("uuid");
class Uuid {
    constructor(uuidString) {
        if (!uuidString) {
            this.uuid = uuid.v4();
            return;
        }
        if (uuidString.uuid)
            uuidString = uuidString.uuid;
        const isValidUuid = uuid.validate(uuidString);
        if (!isValidUuid)
            throw Error(`Uuid not valid`);
        this.uuid = uuidString;
    }
}
exports.Uuid = Uuid;
//# sourceMappingURL=uuid.js.map