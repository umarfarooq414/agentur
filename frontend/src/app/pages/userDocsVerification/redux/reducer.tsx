import {
  UPLOAD_USER_CONTRACT,
  EMPTY_CONTRACT,
  GET_USER_DOCUMENTS,
  UPDATE_DOCUMENT_USER_STATUS,
  UPLOAD_USER_DOCUMENTS,
} from './VerificationDocsConstant'

export const VerificationDocsData = (data = [], action: any) => {
  switch (action.type) {
    case UPLOAD_USER_CONTRACT:
      return [action.data, ...data]
    case GET_USER_DOCUMENTS:
      return [action.data, ...data]
    case UPLOAD_USER_DOCUMENTS:
      return [action.data, ...data]
    case UPDATE_DOCUMENT_USER_STATUS:
      return [action.data, ...data]
    case UPDATE_DOCUMENT_USER_STATUS:
      return [action.data, ...data]
    case EMPTY_CONTRACT:
      data = []
      return [...data]
    default:
      return data
  }
}
