export interface IServerConfigAdmin {
  email: string;
  userName: string;
  firstName: string;
  lastName: string;
  password: string;
}

export interface IServerConfigAdminSupport2 {
  email: string;
  userName: string;
  firstName: string;
  lastName: string;
  password: string;
}

export interface IServerConfig {
  port: number;
  admin: IServerConfigAdmin;
  support2: IServerConfigAdminSupport2;
  productName: string;
  frontendUrl: string;
  supportEmail: string;
  authOtpVerificationLink: string;
  authLoginLink: string;
}

export enum ServerConfigEnum {
  PORT = 'port',
  ADMIN = 'admin',
  SUPPORT2 = 'support2',
  PRODUCT_NAME = 'productName',
  FRONTEND_URL = 'frontendUrl',
  SUPPORT_EMAIL = 'supportEmail',
  AUTH_OTP_VERIFICATION_LINK = 'authOtpVerificationLink',
  AUTH_LOGIN_LINK = 'authLoginLink',
}
