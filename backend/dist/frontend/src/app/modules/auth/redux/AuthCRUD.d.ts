import { AuthModel } from '../models/AuthModel';
import { UserModel } from '../models/UserModel';
export declare const GET_USER_BY_access_token_URL: string;
export declare const LOGIN_URL: string;
export declare const REGISTER_URL: string;
export declare const REQUEST_OTP_URL: string;
export declare const VERIFY_OTP_URL: string;
export declare const RESET_PASSWORD_URL: string;
export declare const SOCIAL_LOGIN_URL: string;
export declare const GET_USER_MESSAGES_URL: string;
export declare const GET_ADMIN_MESSAGES_URL: string;
export declare const GET_NOTIFICATIONS_URL: string;
export declare const GET_ANNOUNCEMENTS_URL: string;
export declare const GET_ACTIVE_USERS_URL: string;
export declare const DELETE_ANNOUNCEMNET_URL: string;
export declare const GET_USER_URL: string;
export declare function login(email: string, password: string): Promise<import("axios").AxiosResponse<any>>;
export declare function socialLogin(access_token: string, provider: string): Promise<import("axios").AxiosResponse<any>>;
export declare function getUsers(access_token: string): Promise<import("axios").AxiosResponse<any>>;
export declare function getActiveUsers(): Promise<import("axios").AxiosResponse<any>>;
export declare function getUser(id: string): Promise<import("axios").AxiosResponse<any>>;
export declare function getAdmin(access_token: string): Promise<import("axios").AxiosResponse<any>>;
export declare function getUserChats(access_token: string): Promise<import("axios").AxiosResponse<any>>;
export declare function getActiveAnnouncemnets(): Promise<import("axios").AxiosResponse<any>>;
export declare function getAdminChats(userId: string): Promise<import("axios").AxiosResponse<any>>;
export declare function getUserChat(userId: string): Promise<import("axios").AxiosResponse<any>>;
export declare function deleteAdminAnnouncement(Id: string): Promise<import("axios").AxiosResponse<any>>;
export declare function getMessageCount(userId: string): Promise<import("axios").AxiosResponse<any>>;
export declare function register(email: string, userName: string, firstName: string, lastName: string, password: string): Promise<import("axios").AxiosResponse<AuthModel>>;
export declare function requestOTP(email: string): Promise<import("axios").AxiosResponse<{
    result: unknown;
}>>;
export declare function verifyOtp(otp: number, email: string): Promise<import("axios").AxiosResponse<{
    result: unknown;
}>>;
export declare function resetPassword(password: string, access_token: string): Promise<import("axios").AxiosResponse<{
    result: unknown;
}>>;
export declare function getUserByToken(): Promise<import("axios").AxiosResponse<UserModel>>;
