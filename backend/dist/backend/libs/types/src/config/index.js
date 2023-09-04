"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ConfigEnum = void 0;
__exportStar(require("./swagger"), exports);
__exportStar(require("./server"), exports);
__exportStar(require("./jwt"), exports);
__exportStar(require("./mail"), exports);
__exportStar(require("./social"), exports);
var ConfigEnum;
(function (ConfigEnum) {
    ConfigEnum["TYPEORM"] = "typeorm";
    ConfigEnum["SERVER"] = "server";
    ConfigEnum["SWAGGER"] = "swagger";
    ConfigEnum["JWT_TOKEN"] = "jwtToken";
    ConfigEnum["MAIL"] = "MAIL";
    ConfigEnum["SOCIAL"] = "SOCIAL";
})(ConfigEnum = exports.ConfigEnum || (exports.ConfigEnum = {}));
//# sourceMappingURL=index.js.map