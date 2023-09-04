import { Action } from '@reduxjs/toolkit';
import { UserModel } from '../models/UserModel';
import { Message } from '../../../../_metronic/helpers/userData';
export interface ActionWithPayload<T> extends Action {
    payload?: T;
}
export declare const actionTypes: {
    Login: string;
    Logout: string;
    Register: string;
    UserRequested: string;
    UserLoaded: string;
    SetUser: string;
    SetError: string;
    SetCount: string;
    SetData: string;
    SetNotification: string;
    SetNotificationCount: string;
};
export interface IAuthState {
    user?: UserModel;
    access_token?: string;
    error?: string;
    role?: string;
    notification?: Record<string, number>;
    count?: number;
    data?: Message;
}
export declare const reducer: import("redux").Reducer<IAuthState & import("redux-persist/es/persistReducer").PersistPartial, ActionWithPayload<IAuthState>>;
export declare const actions: {
    login: (access_token: string) => {
        type: string;
        payload: {
            access_token: string;
        };
    };
    setCount: (count: number) => {
        type: string;
        payload: {
            count: number;
        };
    };
    setData: (data: Message) => {
        type: string;
        payload: {
            data: Message;
        };
    };
    setNotification: (userId: string, count: number) => {
        type: string;
        payload: {
            userId: string;
            count: number;
        };
    };
    setNotificationCount: (userId: string, count: number) => {
        type: string;
        payload: {
            userId: string;
            count: number;
        };
    };
    register: (access_token: string) => {
        type: string;
        payload: {
            access_token: string;
        };
    };
    logout: () => {
        type: string;
    };
    setError: (error: string) => {
        type: string;
        payload: {
            error: string;
        };
    };
    requestUser: () => {
        type: string;
    };
    fulfillUser: (user: UserModel) => {
        type: string;
        payload: {
            user: UserModel;
        };
    };
    setUser: (user: UserModel) => {
        type: string;
        payload: {
            user: UserModel;
        };
    };
};
export declare function saga(): Generator<import("redux-saga/effects").ForkEffect<never>, void, unknown>;
