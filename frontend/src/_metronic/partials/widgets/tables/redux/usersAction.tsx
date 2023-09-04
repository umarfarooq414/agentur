// import {USERS_LIST} from './usersconstant'
// import {USERS_LIST} from './Usersconstant'

import {
  UPDATE_USER_STATUS,
  USERS_LIST,
  SET_USER_DETAIL,
  UPDATE_USER_DETAILS,
  UPDATE_USER_PASSWORD,
  UPDATE_USER_STATUS_RES,
  DELETE_USER,
  RESET_DELETE_USER,
  DELETE_USER_RES,
} from './usersconstant'

export const UsersList = () => {
  return {
    type: USERS_LIST,
  }
}

export const GetUserDetail = (userId: string) => {
  return {
    type: SET_USER_DETAIL,
    payload: {ID: userId},
  }
}

export const UpdateUserStatus = (userId: string, status: string) => {
  return {
    type: UPDATE_USER_STATUS,
    payload: {userId, status},
  }
}

export const updateUserDetails = (firstName: string, lastName: string) => {
  return {
    type: UPDATE_USER_DETAILS,
    payload: {firstName, lastName},
  }
}
export const updateUserPassword = (password: any) => {
  return {
    type: UPDATE_USER_PASSWORD,
    payload: {password},
  }
}

export const updateStatusReset = () => {
  return {
    type: UPDATE_USER_STATUS_RES,
    payload: undefined,
  }
}

export const deleteUser = (id: string) => {
  return {
    type: DELETE_USER,
    payload: id,
  }
}

export const resetDeleteUser = () => {
  return {
    type: DELETE_USER_RES,
    payload: undefined,
  }
}
