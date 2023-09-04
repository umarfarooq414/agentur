"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SocialProviderEnum = exports.UserRoleEnum = exports.UserStatusEnum = void 0;
var UserStatusEnum;
(function (UserStatusEnum) {
    UserStatusEnum["INACTIVE"] = "INACTIVE";
    UserStatusEnum["ACTIVE"] = "ACTIVE";
    UserStatusEnum["DEACTIVATE"] = "DEACTIVATE";
})(UserStatusEnum = exports.UserStatusEnum || (exports.UserStatusEnum = {}));
var UserRoleEnum;
(function (UserRoleEnum) {
    UserRoleEnum["ADMIN"] = "ADMIN";
    UserRoleEnum["MEMBER"] = "MEMBER";
})(UserRoleEnum = exports.UserRoleEnum || (exports.UserRoleEnum = {}));
var SocialProviderEnum;
(function (SocialProviderEnum) {
    SocialProviderEnum["GOOGLE"] = "google";
    SocialProviderEnum["FACEBOOK"] = "FACEBOOK";
})(SocialProviderEnum = exports.SocialProviderEnum || (exports.SocialProviderEnum = {}));
//# sourceMappingURL=UserModel.js.map