import {
  GET_USER_DOCUMENTS,
  GET_USER_DOCUMENTS_SUCCESS,
  UPLOAD_USER_CONTRACT,
  UPDATE_DOCUMENT_USER_STATUS,
  CONTRACT_UPLOAD_RES,
  UPLOAD_USER_DOCUMENTS,
  MUTATE_LOADING_STATE,
} from './VerificationDocsConstant'

interface IInitialState {
  uploadedContract: any
  userDocuments: any
  updateUserDocsStatus: any
  uploadedUserDocuments: any
}

const initialState: IInitialState = {
  uploadedContract: ``,
  userDocuments: null,
  updateUserDocsStatus: null,
  uploadedUserDocuments: null,
}

export const Contracts = (state = initialState, action: any) => {
  switch (action.type) {
    case UPDATE_DOCUMENT_USER_STATUS:
      console.log('status updated')
      return { ...state, updateUserDocsStatus: action?.payload }
    case CONTRACT_UPLOAD_RES:
      console.log('dkd i here')
      return { ...state, uploadedContract: action?.payload }
    case MUTATE_LOADING_STATE:
      return { ...state, uploadedContract: action?.payload }
    case GET_USER_DOCUMENTS_SUCCESS:
      return { ...state, userDocuments: action.payload, error: null }
    case UPLOAD_USER_DOCUMENTS:
      console.log('dkd i DOCUMENTs here')
      return { ...state, uploadedContract: action?.payload }
    default:
      return state
  }
}
