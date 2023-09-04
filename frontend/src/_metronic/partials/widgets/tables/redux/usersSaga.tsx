// import axios from 'axios';
import {takeEvery, put, call} from 'redux-saga/effects'
import {
  USERS_LIST,
  SET_USERS_LIST,
  UPDATE_USER_STATUS,
  SET_USER_DETAIL,
  SET_USER_DETAIL_LOADED,
  UPDATE_USER_STATUS_RES,
} from './usersconstant'
import axios from 'axios'
import {UserModel} from '../../../../../app/modules/auth/models/UserModel'
const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5500'

export const GET_USERS_URL = `${API_URL}/api/user`
export const GET_USER_BY_ID_URL = `${API_URL}/api/user/id`
export const UPDATE_USERS_STATUS_URL = `${API_URL}/api/auth/update-status`

function* getUsers(): any {
  let data = yield axios.get(GET_USERS_URL)
  if (data.data) yield put({type: SET_USERS_LIST, data: data.data})
}

function getUserByid(id: string) {
  axios
    .get(GET_USER_BY_ID_URL)
    .then((data: any) => {
      if (data.data) return data.data
      return data
    })
    .catch((error) => {
      return error
    })
}

export function getData(userId: string) {
  return axios
    .get(GET_USER_BY_ID_URL + `/${userId}`)
    .then((response) => {
      return response.data
    })
    .catch((error) => {
      return error
    })
}

function* userDetailSaga(action: any): any {
  try {
    const payload = yield call(getData, action.payload.ID)
    yield put({type: SET_USER_DETAIL_LOADED, payload})
  } catch (e) {
    yield put({type: 'API_ERRORED', payload: e})
  }
}

export function* updateStatus({payload}: any): any {
  try {
    const {userId, status} = payload
    const res = yield axios.put(`${UPDATE_USERS_STATUS_URL}`, {status, userId})
    yield put({type: UPDATE_USER_STATUS_RES, payload: res.data.message})
  } catch (error) {
    yield put({type: UPDATE_USER_STATUS_RES, payload: false})
  }
}

function* UsersSaga() {
  yield takeEvery(USERS_LIST, getUsers)
  yield takeEvery(SET_USER_DETAIL, userDetailSaga)
  yield takeEvery(UPDATE_USER_STATUS, updateStatus)
}

export default UsersSaga
