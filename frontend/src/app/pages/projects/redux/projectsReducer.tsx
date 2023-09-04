import {
  All_PROJECTS_DATA,
  PROJECT_CREATED_RES,
  DELETE_PROJECT_RES,
  UPDATE_SPECIFIC_RES,
  REMOVE_SPECIFIC_PROJECT,
  GET_SPECIFIC_PROJECT_RES,
  MUTATE_PROJECT_FLAG,
} from './Projectsconstant'

interface IInitialState {
  projectMutated: any
  allProjects: any
  specificProject: any
}

const initialState: IInitialState = {
  projectMutated: ``,
  allProjects: ``,
  specificProject: null,
}

export const Projects = (state = initialState, action: any) => {
  switch (action.type) {
    case All_PROJECTS_DATA:
      return {...state, allProjects: action?.payload}
    case GET_SPECIFIC_PROJECT_RES:
      return {...state, specificProject: action?.payload}
    case REMOVE_SPECIFIC_PROJECT:
      return {...state, specificProject: null}
    case DELETE_PROJECT_RES:
      return {...state, projectMutated: action?.payload}
    case PROJECT_CREATED_RES:
      return {...state, projectMutated: action?.payload}
    case UPDATE_SPECIFIC_RES:
      return {...state, projectMutated: action?.payload}
    case MUTATE_PROJECT_FLAG:
      return {...state, projectMutated: action?.payload}
    default:
      return state
  }
}
