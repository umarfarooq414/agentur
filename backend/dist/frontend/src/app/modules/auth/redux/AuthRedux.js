"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.saga = exports.actions = exports.reducer = exports.actionTypes = void 0;
const redux_persist_1 = require("redux-persist");
const storage_1 = require("redux-persist/lib/storage");
const effects_1 = require("redux-saga/effects");
const AuthCRUD_1 = require("./AuthCRUD");
exports.actionTypes = {
    Login: '[Login] Action',
    Logout: '[Logout] Action',
    Register: '[Register] Action',
    UserRequested: '[Request User] Action',
    UserLoaded: '[Load User] Auth API',
    SetUser: '[Set User] Action',
    SetError: '[Set Error] Action',
    SetCount: '[Set Alert] Action',
    SetData: '[Set Data] Action',
    SetNotification: '[Set Notification] Action',
    SetNotificationCount: '[Set Notification Count] Action'
};
const initialAuthState = {
    user: undefined,
    access_token: undefined,
    error: undefined,
    role: undefined,
    count: undefined,
    data: undefined,
    notification: {},
};
exports.reducer = (0, redux_persist_1.persistReducer)({ storage: storage_1.default, key: 'auth', whitelist: ['user', 'access_token', 'count', 'data'] }, (state = initialAuthState, action) => {
    var _a, _b, _c, _d, _e, _f, _g;
    switch (action.type) {
        case exports.actionTypes.Login: {
            const access_token = (_a = action.payload) === null || _a === void 0 ? void 0 : _a.access_token;
            return { access_token };
        }
        case exports.actionTypes.SetError: {
            const error = (_b = action.payload) === null || _b === void 0 ? void 0 : _b.error;
            return Object.assign(Object.assign({}, state), { error });
        }
        case exports.actionTypes.Register: {
            const access_token = (_c = action.payload) === null || _c === void 0 ? void 0 : _c.access_token;
            return { access_token, user: undefined };
        }
        case exports.actionTypes.Logout: {
            return initialAuthState;
        }
        case exports.actionTypes.UserRequested: {
            return Object.assign(Object.assign({}, state), { user: undefined });
        }
        case exports.actionTypes.UserLoaded: {
            const user = (_d = action.payload) === null || _d === void 0 ? void 0 : _d.user;
            return Object.assign(Object.assign({}, state), { user });
        }
        case exports.actionTypes.SetUser: {
            const user = (_e = action.payload) === null || _e === void 0 ? void 0 : _e.user;
            return Object.assign(Object.assign({}, state), { user });
        }
        case exports.actionTypes.SetCount: {
            const count = (_f = action.payload) === null || _f === void 0 ? void 0 : _f.count;
            return Object.assign(Object.assign({}, state), { count });
        }
        case exports.actionTypes.SetData: {
            const data = (_g = action.payload) === null || _g === void 0 ? void 0 : _g.data;
            return Object.assign(Object.assign({}, state), { data });
        }
        case exports.actionTypes.SetNotification: {
            const { userId } = action.payload;
            const notification = Object.assign({}, state.notification);
            const count = notification[userId] ? notification[userId] + 1 : 1;
            notification[userId] = count;
            return Object.assign(Object.assign({}, state), { notification });
        }
        case exports.actionTypes.SetNotificationCount: {
            const { userId, count } = action.payload;
            const notification = Object.assign({}, state.notification);
            notification[userId] = count;
            return Object.assign(Object.assign({}, state), { notification });
        }
        default:
            return state;
    }
});
exports.actions = {
    login: (access_token) => ({
        type: exports.actionTypes.Login,
        payload: { access_token },
    }),
    setCount: (count) => ({
        type: exports.actionTypes.SetCount,
        payload: {
            count
        }
    }),
    setData: (data) => ({
        type: exports.actionTypes.SetData,
        payload: {
            data
        }
    }),
    setNotification: (userId, count) => ({
        type: exports.actionTypes.SetNotification,
        payload: { userId, count },
    }),
    setNotificationCount: (userId, count) => ({
        type: exports.actionTypes.SetNotificationCount,
        payload: { userId, count },
    }),
    register: (access_token) => ({
        type: exports.actionTypes.Register,
        payload: { access_token },
    }),
    logout: () => ({
        type: exports.actionTypes.Logout,
    }),
    setError: (error) => ({
        type: exports.actionTypes.SetError,
        payload: { error },
    }),
    requestUser: () => ({
        type: exports.actionTypes.UserRequested,
    }),
    fulfillUser: (user) => ({
        type: exports.actionTypes.UserLoaded,
        payload: { user },
    }),
    setUser: (user) => ({ type: exports.actionTypes.SetUser, payload: { user } }),
};
function* saga() {
    yield (0, effects_1.takeLatest)(exports.actionTypes.Login, function* loginSaga() {
        yield (0, effects_1.put)(exports.actions.requestUser());
    });
    yield (0, effects_1.takeLatest)(exports.actionTypes.Register, function* registerSaga() {
        yield (0, effects_1.put)(exports.actions.requestUser());
    });
    yield (0, effects_1.takeLatest)(exports.actionTypes.UserRequested, function* userRequested() {
        const { data: user } = yield (0, AuthCRUD_1.getUserByToken)();
        yield (0, effects_1.put)(exports.actions.fulfillUser(user));
    });
}
exports.saga = saga;
//# sourceMappingURL=AuthRedux.js.map