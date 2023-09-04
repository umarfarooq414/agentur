import {ADD_TO_PROJECTS, EMPTY_PROJECTS} from './Projectsconstant'

export const ProjectsData = (data = [], action: any) => {
  switch (action.type) {
    case ADD_TO_PROJECTS:
      return [action.data, ...data]
    case EMPTY_PROJECTS:
      data = []
      return [...data]
    default:
      return data
  }
}
