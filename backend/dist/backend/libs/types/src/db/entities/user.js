"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SocialProviderEnum = exports.UserRoleEnum = exports.DocumentNameEnum = exports.DocumentStatusEnum = exports.UserStatusEnum = void 0;
var UserStatusEnum;
(function (UserStatusEnum) {
    UserStatusEnum["INACTIVE"] = "INACTIVE";
    UserStatusEnum["ACTIVE"] = "ACTIVE";
    UserStatusEnum["DEACTIVATE"] = "DEACTIVATE";
})(UserStatusEnum = exports.UserStatusEnum || (exports.UserStatusEnum = {}));
var DocumentStatusEnum;
(function (DocumentStatusEnum) {
    DocumentStatusEnum["APPROVED"] = "APPROVED";
    DocumentStatusEnum["REJECTED"] = "REJECTED";
    DocumentStatusEnum["PENDING"] = "PENDING";
})(DocumentStatusEnum = exports.DocumentStatusEnum || (exports.DocumentStatusEnum = {}));
var DocumentNameEnum;
(function (DocumentNameEnum) {
    DocumentNameEnum["CONTRACT"] = "CONTRACT";
    DocumentNameEnum["ID_FRONT"] = "ID_FRONT";
    DocumentNameEnum["ID_BACK"] = "ID_BACK";
    DocumentNameEnum["SELFIE"] = "SELFIE";
})(DocumentNameEnum = exports.DocumentNameEnum || (exports.DocumentNameEnum = {}));
var UserRoleEnum;
(function (UserRoleEnum) {
    UserRoleEnum["ADMIN"] = "ADMIN";
    UserRoleEnum["MEMBER"] = "MEMBER";
})(UserRoleEnum = exports.UserRoleEnum || (exports.UserRoleEnum = {}));
var SocialProviderEnum;
(function (SocialProviderEnum) {
    SocialProviderEnum["GOOGLE"] = "google";
    SocialProviderEnum["FACEBOOK"] = "facebook";
})(SocialProviderEnum = exports.SocialProviderEnum || (exports.SocialProviderEnum = {}));
//# sourceMappingURL=user.js.map