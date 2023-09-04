export interface IJwtConfig {
    secret: string;
    expireIn: string;
}
export declare enum JwtConfigEnum {
    SECRET = "secret",
    EXPIRE_IN = "expireIn"
}
