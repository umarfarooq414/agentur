import {ADD_TO_USERS, EMPTY_USERS} from './usersconstant'

export const cartData = (data = [], action: any) => {
  switch (action.type) {
    case ADD_TO_USERS:
      return [action.data, ...data]
    case EMPTY_USERS:
      data = []
      return [...data]
    default:
      return data
  }
}
