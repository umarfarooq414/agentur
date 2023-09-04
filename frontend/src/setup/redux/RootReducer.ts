import {all} from 'redux-saga/effects'
import {combineReducers} from 'redux'
import * as auth from '../../app/modules/auth'
import {Projects} from '../../app/pages/projects/redux/projectsReducer'
import {usersData} from '../../_metronic/partials/widgets/tables/redux/usersReducer'
import {Contracts} from '../../app/pages/userDocsVerification/redux/verificationDocsReducer'

export const rootReducer = combineReducers({
  auth: auth.reducer,
  user: usersData,
  Projects,
  Contracts,
})

export type RootState = ReturnType<typeof rootReducer>

export function* rootSaga() {
  yield all([auth.saga()])
}
