import * as auth from '../../app/modules/auth';
export declare const rootReducer: import("redux").Reducer<import("redux").CombinedState<{
    auth: auth.IAuthState & import("redux-persist/es/persistReducer").PersistPartial;
    user: unknown;
    Projects: unknown;
}>, import("redux").Action<any>>;
export type RootState = ReturnType<typeof rootReducer>;
export declare function rootSaga(): Generator<import("redux-saga/effects").AllEffect<Generator<import("redux-saga/effects").ForkEffect<never>, void, unknown>>, void, unknown>;
