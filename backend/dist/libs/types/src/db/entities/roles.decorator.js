"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserRole = exports.USER_ROLE_KEY = void 0;
const common_1 = require("@nestjs/common");
exports.USER_ROLE_KEY = 'userRole';
const UserRole = (role) => (0, common_1.SetMetadata)(exports.USER_ROLE_KEY, role);
exports.UserRole = UserRole;
//# sourceMappingURL=roles.decorator.js.map