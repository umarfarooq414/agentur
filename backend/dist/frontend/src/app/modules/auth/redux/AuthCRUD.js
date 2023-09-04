"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getUserByToken = exports.resetPassword = exports.verifyOtp = exports.requestOTP = exports.register = exports.getMessageCount = exports.deleteAdminAnnouncement = exports.getUserChat = exports.getAdminChats = exports.getActiveAnnouncemnets = exports.getUserChats = exports.getAdmin = exports.getUser = exports.getActiveUsers = exports.getUsers = exports.socialLogin = exports.login = exports.GET_USER_URL = exports.DELETE_ANNOUNCEMNET_URL = exports.GET_ACTIVE_USERS_URL = exports.GET_ANNOUNCEMENTS_URL = exports.GET_NOTIFICATIONS_URL = exports.GET_ADMIN_MESSAGES_URL = exports.GET_USER_MESSAGES_URL = exports.SOCIAL_LOGIN_URL = exports.RESET_PASSWORD_URL = exports.VERIFY_OTP_URL = exports.REQUEST_OTP_URL = exports.REGISTER_URL = exports.LOGIN_URL = exports.GET_USER_BY_access_token_URL = void 0;
const axios_1 = require("axios");
const API_URL = process.env.REACT_APP_API_URL || 'api';
const USERS_URL = `${API_URL}/api/user`;
const CHATS_URL = `${API_URL}/api/chats`;
exports.GET_USER_BY_access_token_URL = `${API_URL}/api/user/user-by-token`;
exports.LOGIN_URL = `${API_URL}/api/auth/login`;
exports.REGISTER_URL = `${API_URL}/api/auth/register`;
exports.REQUEST_OTP_URL = `${API_URL}/api/auth/forget`;
exports.VERIFY_OTP_URL = `${API_URL}/api/auth/verify-otp`;
exports.RESET_PASSWORD_URL = `${API_URL}/api/auth/reset`;
exports.SOCIAL_LOGIN_URL = `${API_URL}/api/auth/social-login`;
exports.GET_USER_MESSAGES_URL = `${CHATS_URL}/userChats`;
exports.GET_ADMIN_MESSAGES_URL = `${CHATS_URL}/adminChats`;
exports.GET_NOTIFICATIONS_URL = `${CHATS_URL}/notifications`;
exports.GET_ANNOUNCEMENTS_URL = `${CHATS_URL}/getAnnouncements`;
exports.GET_ACTIVE_USERS_URL = `${CHATS_URL}/user`;
exports.DELETE_ANNOUNCEMNET_URL = `${CHATS_URL}/deleteAnnouncement`;
exports.GET_USER_URL = `${USERS_URL}/id/:id`;
async function fun(email, password) {
    const res = await axios_1.default.post(exports.LOGIN_URL, { email, password });
}
function login(email, password) {
    fun(email, password);
    return axios_1.default.post(exports.LOGIN_URL, { email, password });
}
exports.login = login;
async function socialLogin(access_token, provider) {
    return await axios_1.default.post(exports.SOCIAL_LOGIN_URL, {
        accessToken: access_token,
        socialProvider: provider,
    });
}
exports.socialLogin = socialLogin;
async function getUsers(access_token) {
    return await axios_1.default.get(USERS_URL, {
        headers: {
            access_token,
        }
    });
}
exports.getUsers = getUsers;
async function getActiveUsers() {
    return await axios_1.default.get(exports.GET_ACTIVE_USERS_URL);
}
exports.getActiveUsers = getActiveUsers;
async function getUser(id) {
    return await axios_1.default.get(exports.GET_USER_URL, {
        params: {
            token: id
        }
    });
}
exports.getUser = getUser;
async function getAdmin(access_token) {
    return await axios_1.default.get(CHATS_URL, {
        headers: {
            access_token,
        }
    });
}
exports.getAdmin = getAdmin;
async function getUserChats(access_token) {
    return await axios_1.default.get(exports.GET_USER_MESSAGES_URL, {
        headers: {
            access_token,
        }
    });
}
exports.getUserChats = getUserChats;
async function getActiveAnnouncemnets() {
    return await axios_1.default.get(exports.GET_ANNOUNCEMENTS_URL);
}
exports.getActiveAnnouncemnets = getActiveAnnouncemnets;
async function getAdminChats(userId) {
    return await axios_1.default.get(exports.GET_ADMIN_MESSAGES_URL, {
        headers: {
            token: userId
        }
    });
}
exports.getAdminChats = getAdminChats;
async function getUserChat(userId) {
    return await axios_1.default.get(exports.GET_USER_MESSAGES_URL, {
        headers: {
            token: userId
        }
    });
}
exports.getUserChat = getUserChat;
async function deleteAdminAnnouncement(Id) {
    return await axios_1.default.delete(exports.DELETE_ANNOUNCEMNET_URL, {
        headers: {
            token: Id
        }
    });
}
exports.deleteAdminAnnouncement = deleteAdminAnnouncement;
async function getMessageCount(userId) {
    return await axios_1.default.get(exports.GET_NOTIFICATIONS_URL, {
        headers: {
            token: userId
        }
    });
}
exports.getMessageCount = getMessageCount;
function register(email, userName, firstName, lastName, password) {
    return axios_1.default.post(exports.REGISTER_URL, {
        email,
        userName,
        firstName,
        lastName,
        password,
    });
}
exports.register = register;
function requestOTP(email) {
    return axios_1.default.post(exports.REQUEST_OTP_URL, { email });
}
exports.requestOTP = requestOTP;
function verifyOtp(otp, email) {
    return axios_1.default.post(exports.VERIFY_OTP_URL, { otp, email });
}
exports.verifyOtp = verifyOtp;
function resetPassword(password, access_token) {
    return axios_1.default.post(exports.RESET_PASSWORD_URL, { password }, {
        headers: {
            Authorization: 'Bearer ' + access_token,
        },
    });
}
exports.resetPassword = resetPassword;
function getUserByToken() {
    return axios_1.default.get(exports.GET_USER_BY_access_token_URL);
}
exports.getUserByToken = getUserByToken;
//# sourceMappingURL=AuthCRUD.js.map