import {UserModel} from '../../../../../app/modules/auth/models/UserModel'
import {
  DELETE_USER_RES,
  SET_USERS_LIST,
  SET_USER_DETAIL_LOADED,
  UPDATE_USER_DETAILS,
  UPDATE_USER_PASSWORD,
  UPDATE_USER_STATUS,
  UPDATE_USER_STATUS_RES,
} from './usersconstant'

export interface IUserReduxState {
  users?: UserModel[] | undefined
  userDetail?: UserModel | undefined
  updatedUser?: UserModel | undefined
  updatedPassword?: UserModel | undefined
  userStatusUpdated?: UserModel | undefined
  deletedUser?: UserModel | undefined
}

const initialUserState: IUserReduxState = {
  users: undefined,
  userDetail: undefined,
  updatedUser: undefined,
  updatedPassword: undefined,
  userStatusUpdated: undefined,
  deletedUser: undefined,
}

export const usersData = (state = initialUserState, action: any) => {
  switch (action.type) {
    case SET_USERS_LIST:
      return {
        ...state,
        users: [...action.data],
      }

    case SET_USER_DETAIL_LOADED:
      return {
        ...state,
        userDetail: action.payload,
      }
    case UPDATE_USER_STATUS_RES:
      return {
        ...state,
        userStatusUpdated: action.payload,
      }

    case UPDATE_USER_STATUS:
      const userIndex = state.users?.findIndex((u) => u.id === action.payload.userId)
      if (userIndex !== undefined && userIndex > -1 && state.users) {
        const newUser = state.users[userIndex]
        newUser.status = action.payload.status
        return {
          ...state,
          users: state.users.map((u) => (u.id === action.payload.userId ? newUser : u)),
        }
      } else {
        return state
      }

    case UPDATE_USER_DETAILS:
      return {
        ...state,
        updatedUser: action.payload,
      }
    case UPDATE_USER_PASSWORD:
      return {
        ...state,
        updatedPassword: action.payload,
      }

    case DELETE_USER_RES:
      return {
        ...state,
        deletedUser: action.payload,
      }

    default:
      return state
  }
}
