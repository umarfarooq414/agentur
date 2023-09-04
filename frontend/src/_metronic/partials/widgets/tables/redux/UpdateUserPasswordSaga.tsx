import {put, takeEvery} from 'redux-saga/effects'
import {DELETE_USER, DELETE_USER_RES, UPDATE_USER_PASSWORD} from './usersconstant'
import axios from 'axios'
const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5500/'
export const UPDATE_USER_PASSWORD_URL = `${API_URL}/api/user/update-password`
export const GET_USER_BY_ID_URL = `${API_URL}/api/user/id`
export const DELETE_SPECIFICE_USER_URL = `${API_URL}/api/auth/deleteUser`

export function* updateUserPassword({payload}: any): any {
  try {
    const res = yield axios.put(`${UPDATE_USER_PASSWORD_URL}`, payload)
  } catch (error) {}
}

export function* deleteUserData({payload}: any): any {
  try {
    yield axios.delete(`${DELETE_SPECIFICE_USER_URL}/${payload}`)
    yield put({type: DELETE_USER_RES, payload: 'User Deleted'})
    yield payload.history.push('/Projects')
  } catch (error) {
    yield put({type: DELETE_USER_RES, payload: false})
  }
}

function* UpdateUserPasswordSaga() {
  yield takeEvery(UPDATE_USER_PASSWORD, updateUserPassword)
  yield takeEvery(DELETE_USER, deleteUserData)
}
export default UpdateUserPasswordSaga
