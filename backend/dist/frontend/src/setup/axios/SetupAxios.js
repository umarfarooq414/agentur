"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function setupAxios(axios, store) {
    axios.interceptors.request.use((config) => {
        const { auth: { access_token }, } = store.getState();
        if (access_token) {
            config.headers.Authorization = `Bearer ${access_token}`;
        }
        return config;
    }, (err) => {
        Promise.reject(err);
    });
}
exports.default = setupAxios;
//# sourceMappingURL=SetupAxios.js.map