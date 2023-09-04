// import {PROJECTS_LIST, PROJECTS_LISTS} from './Projectsconstant'
import {PROJECTS_LISTS} from './Projectsconstant'
interface productList {
  projectName: any
  projectInfo: any
  projectCompensation: any
  image: any
}

export const productList = ({projectName, projectInfo, projectCompensation, image}: productList) => {
  return {
    type: PROJECTS_LISTS,
    payload: {projectName, projectInfo, projectCompensation, image},
  }
}
