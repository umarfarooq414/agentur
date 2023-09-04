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
  UPLOAD_USER_CONTRACT,

  UPLOAD_USER_DOCUMENTS,
  GET_USER_DOCUMENTS,
  UPDATE_DOCUMENT_USER_STATUS,
  MUTATE_LOADING_STATE,
} from './VerificationDocsConstant'

export interface IContract {
  userId?: String
  name: String
  file: any
}
export interface IUserDocuments {
  userId?: string
  contract: any
  idBack: any
  selfie: any
  idFront: any
  images?: (string | File)[]
}
export interface IUpdateStatus {
  userId: string
  status: DocumentStatusEnum
  documentId: string
  reason: string
}


export interface IUpdateStatus {
  userId: string
  status: DocumentStatusEnum
  documentId: string
  reason: string
}

export enum DocumentStatusEnum {
  APPROVED = `APPROVED`,
  REJECTED = `REJECTED`,
  PENDING = `PENDING`,
}

export const getHeaders = () => {
  return {
    headers: {
      Authorization: `Bearer ${localStorage.getItem('token')}`,
    },
  }
}
export const uploadUserContract = (contract: IContract) => {
  console.log('dkdjas', contract)
  return {
    type: UPLOAD_USER_CONTRACT,
    payload: { contract },
  }
}
export const uploadUserDocuments = (userDocuments: IUserDocuments) => {
  console.log('dkdjassws', userDocuments)
  return {
    type: UPLOAD_USER_DOCUMENTS,
    payload: { userDocuments },
  }
}
export const getUserDocuments = (payload: any) => {
  console.log('>>> userDocs', payload)
  return {
    type: GET_USER_DOCUMENTS,
    payload: { payload },
  }
}

export const UpdateUserDocsStatus = (updatedStatus: IUpdateStatus) => {
  return {
    type: UPDATE_DOCUMENT_USER_STATUS,
    payload: { updatedStatus },
  }
}
export const handleLoadingState = () => {
  return {
    type: MUTATE_LOADING_STATE,
    payload: '',
  }
}
