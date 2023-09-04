import {configureStore, getDefaultMiddleware} from '@reduxjs/toolkit'
import createSagaMiddleware from 'redux-saga'
import {reduxBatch} from '@manaflair/redux-batch'
import {persistStore} from 'redux-persist'
import {rootReducer, rootSaga} from './RootReducer'
import projectsSaga from '../../app/pages/projects/redux/projectsSaga'
import UsersSaga from '../../_metronic/partials/widgets/tables/redux/usersSaga'
import UpdateUserDetailsSaga from '../../_metronic/partials/widgets/tables/redux/userDetailsUpdateSaga'
import UpdateUserPasswordSaga from '../../_metronic/partials/widgets/tables/redux/UpdateUserPasswordSaga'
import userContractSaga from '../../app/pages/userDocsVerification/redux/verififcationDocsSaga'

const sagaMiddleware = createSagaMiddleware()
const middleware = [
  ...getDefaultMiddleware({
    immutableCheck: false,
    serializableCheck: false,
    thunk: true,
  }),
  sagaMiddleware,
]

const store = configureStore({
  reducer: rootReducer,
  middleware,
  devTools: process.env.NODE_ENV !== 'production',
  enhancers: [reduxBatch],
})

export type AppDispatch = typeof store.dispatch

/**
 * @see https://github.com/rt2zz/redux-persist#persiststorestore-config-callback
 * @see https://github.com/rt2zz/redux-persist#persistor-object
 */
export const persistor = persistStore(store)

sagaMiddleware.run(rootSaga)
sagaMiddleware.run(projectsSaga)
sagaMiddleware.run(UsersSaga)
sagaMiddleware.run(UpdateUserDetailsSaga)
sagaMiddleware.run(UpdateUserPasswordSaga)
sagaMiddleware.run(userContractSaga)

export default store
