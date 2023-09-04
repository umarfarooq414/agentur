import {ADD_TO_USERS, EMPTY_USERS, REMOVE_FROM_USERS} from './usersconstant'

export const addToProjects = (data: any) => {
  return {
    type: ADD_TO_USERS,
    data,
  }
}

export const removeToProjects = (data: any) => {
  return {
    type: REMOVE_FROM_USERS,
    data,
  }
}

export const emptyProjects = () => {
  return {
    type: EMPTY_USERS,
  }
}
