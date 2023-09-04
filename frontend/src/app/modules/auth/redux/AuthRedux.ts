import {Action} from '@reduxjs/toolkit'
import {persistReducer} from 'redux-persist'
import storage from 'redux-persist/lib/storage'
import {put, takeLatest} from 'redux-saga/effects'
import {UserModel} from '../models/UserModel'
import {getUserByToken} from './AuthCRUD'
import { number } from 'yup'
import { Message } from '../../../../_metronic/helpers/userData'
export interface ActionWithPayload<T> extends Action {
  payload?: T
}

export const actionTypes = {
  Login: '[Login] Action',
  Logout: '[Logout] Action',
  Register: '[Register] Action',
  UserRequested: '[Request User] Action',
  UserLoaded: '[Load User] Auth API',
  SetUser: '[Set User] Action',
  SetError: '[Set Error] Action',
  SetCount:'[Set Alert] Action',
  SetData: '[Set Data] Action',
  SetNotification: '[Set Notification] Action',
  SetNotificationCount: '[Set Notification Count] Action'
}

const initialAuthState: IAuthState = {
  user: undefined,
  access_token: undefined,
  error: undefined,
  role:undefined,
  count: undefined,
  data: undefined,
  notification:{},
}

export interface IAuthState {
  user?: UserModel
  access_token?: string
  error?: string
  role?:string
  notification?: Record<string, number>
  count?:number,
  data?:Message
}

export const reducer = persistReducer(
  {storage, key: 'auth', whitelist: ['user', 'access_token','count','data']},
  (state: IAuthState = initialAuthState, action: ActionWithPayload<IAuthState>) => {
    switch (action.type) {
      case actionTypes.Login: {
        const access_token = action.payload?.access_token
        return {access_token}
      }

      case actionTypes.SetError: {
        const error = action.payload?.error
        return {...state, error}
      }

      case actionTypes.Register: {
        const access_token = action.payload?.access_token
        return {access_token, user: undefined}
      }

      case actionTypes.Logout: {
        return initialAuthState
      }

      case actionTypes.UserRequested: {
        return {...state, user: undefined}
      }

      case actionTypes.UserLoaded: {
        const user = action.payload?.user
        return {...state, user}
      }

      case actionTypes.SetUser: {
        const user = action.payload?.user
        return {...state, user}
      }
      case actionTypes.SetCount:{
        const count=action.payload?.count
        return {
          ...state,
          count
        }
      }
      case actionTypes.SetData:{
        const data=action.payload?.data
        return {
          ...state,
          data
        }
      }
      case actionTypes.SetNotification: {
        const { userId } :any= action.payload
      const notification = { ...state.notification };
      const count = notification[userId] ? notification[userId] + 1 : 1;
      notification[userId] = count;
      return { ...state, notification };
    }
    case  actionTypes.SetNotificationCount: {
      const { userId, count }:any = action.payload;
      const notification = { ...state.notification };
      notification[userId] = count;
      return { ...state, notification };
    }
    

      default:
        return state
    }
  }
)

export const actions = {
  login: (access_token: string) => ({
    type: actionTypes.Login,
    payload: {access_token},
  }),

  setCount:(count:number)=>({
    type:actionTypes.SetCount,
    payload:{
      count
    }
  }),
  setData:(data:Message)=>({
    type:actionTypes.SetData,
    payload:{
      data
    }
  }),

  setNotification: (userId: string, count: number) => ({
    type: actionTypes.SetNotification,
    payload: { userId, count },
  }),

  setNotificationCount: (userId: string, count: number) => ({
    type: actionTypes.SetNotificationCount,
    payload: { userId, count },
  }),


  register: (access_token: string) => ({
    type: actionTypes.Register,
    payload: {access_token},
  }),

  logout: () => ({
    type: actionTypes.Logout,
  }),
  setError: (error: string) => ({
    type: actionTypes.SetError,
    payload: {error},
  }),

  requestUser: () => ({
    type: actionTypes.UserRequested,
  }),

  fulfillUser: (user: UserModel) => ({
    type: actionTypes.UserLoaded,
    payload: {user},
  }),
  setUser: (user: UserModel) => ({type: actionTypes.SetUser, payload: {user}}),
}

export function* saga() {
  yield takeLatest(actionTypes.Login, function* loginSaga() {
    yield put(actions.requestUser())
  })

  yield takeLatest(actionTypes.Register, function* registerSaga() {
    yield put(actions.requestUser())
  })

  yield takeLatest(actionTypes.UserRequested, function* userRequested() {
    const {data: user} = yield getUserByToken()
    yield put(actions.fulfillUser(user))
  })
}
