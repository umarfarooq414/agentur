"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.rootSaga = exports.rootReducer = void 0;
const effects_1 = require("redux-saga/effects");
const redux_1 = require("redux");
const auth = require("../../app/modules/auth");
const projectsReducer_1 = require("../../app/pages/projects/redux/projectsReducer");
const usersReducer_1 = require("../../_metronic/partials/widgets/tables/redux/usersReducer");
exports.rootReducer = (0, redux_1.combineReducers)({
    auth: auth.reducer,
    user: usersReducer_1.usersData,
    Projects: projectsReducer_1.Projects
});
function* rootSaga() {
    yield (0, effects_1.all)([auth.saga()]);
}
exports.rootSaga = rootSaga;
//# sourceMappingURL=RootReducer.js.map