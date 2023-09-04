import {put, takeEvery} from 'redux-saga/effects'
import {useHistory} from 'react-router-dom'

import {UPDATE_USER_DETAILS} from './usersconstant'
import axios from 'axios'
const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5500'
export const UPDATE_USER_DETAILS_URL = `${API_URL}/api/user/update`
export const GET_USER_BY_ID_URL = `${API_URL}/api/user/id`

export function* updateDetails({payload}: any): any {
  try {
    const res = yield axios.put(`${UPDATE_USER_DETAILS_URL}`, payload)
    yield put({type: 'UPDATE_USER_DETAILS_SUCCESS', payload: res})
    setTimeout(window.location.reload.bind(window.location), 5000)
  } catch (error) {
    yield put({type: 'UPDATE_USER_DETAILS_FAILURE', error})
  }
}
function* UpdateUserDetailsSaga() {
  yield takeEvery(UPDATE_USER_DETAILS, updateDetails)
}

export default UpdateUserDetailsSaga
