import {
  ADD_TO_PROJECTS,
  EMPTY_PROJECTS,
  REMOVE_FROM_PROJECTS,
  GET_All_PROJECTS,
  DELETE_PROJECT,
  GET_SPECIFIC_PROJECT,
  UPDATE_SPECIFIC_PROJECT,
  CREATE_PROJECT,
  REMOVE_SPECIFIC_PROJECT,
  GET_SPECIFIC_PROJECT_RES,
  MUTATE_PROJECT_FLAG,
} from './Projectsconstant'

interface IProject {
  id?: String
  projectName: String
  projectInfo: String
  projectCompensation: String
  image: any
  projectTeam: any
}

export const addToPROJECTS = (data: any) => {
  return {
    type: ADD_TO_PROJECTS,
    data,
  }
}

export const removeToPROJECTS = (data: any) => {
  return {
    type: REMOVE_FROM_PROJECTS,
    data,
  }
}

export const emptyPROJECTS = () => {
  return {
    type: EMPTY_PROJECTS,
  }
}

export const getAllProjects = () => {
  return {
    type: GET_All_PROJECTS,
  }
}

export const createProject = (project: IProject, history: any) => {
  return {
    type: CREATE_PROJECT,
    payload: {project, history},
  }
}

export const deleteProject = (id: String) => {
  return {
    type: DELETE_PROJECT,
    payload: id,
  }
}

export const getSpecificProject = (id: string) => {
  return {
    type: GET_SPECIFIC_PROJECT,
    payload: id,
  }
}

export const removeSpecificProject = () => {
  return {
    type: REMOVE_SPECIFIC_PROJECT,
  }
}

export const updateSpecificProject = (project: IProject, history: any) => {
  return {
    type: UPDATE_SPECIFIC_PROJECT,
    payload: {project, history},
  }
}

export const handleMutateProjectFlag = () => {
  return {
    type: MUTATE_PROJECT_FLAG,
    payload: '',
  }
}
