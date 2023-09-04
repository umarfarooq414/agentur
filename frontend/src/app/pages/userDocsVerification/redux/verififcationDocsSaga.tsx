import axios from 'axios'
import {takeEvery, put} from 'redux-saga/effects'
import {toast} from 'react-toastify'
import {
  // GET_All_PROJECTS,
  // All_PROJECTS_DATA,
  // CREATE_PROJECT,
  // PROJECT_CREATED_RES,
  // DELETE_PROJECT,
  // DELETE_PROJECT_RES,
  // UPDATE_SPECIFIC_RES,
  // UPDATE_SPECIFIC_PROJECT,
  // GET_SPECIFIC_PROJECT,
  // GET_SPECIFIC_PROJECT_RES,
  UPLOAD_USER_CONTRACT,
  UPLOAD_USER_DOCUMENTS,
  CONTRACT_UPLOAD_RES,
  GET_USER_DOCUMENTS,
  GET_USER_DOCUMENTS_SUCCESS,
  GET_USER_DOCUMENTS_FAILURE,
  UPDATE_DOCUMENT_USER_STATUS,
  UPDATE_DOCUMENT_USER_STATUS_SUCCESS,
  UPDATE_DOCUMENT_USER_STATUS_FAILURE,
} from './VerificationDocsConstant'
import {IContract, IUpdateStatus, IUserDocuments} from './action'
import {updatePassword} from './../../../modules/accounts/components/settings/SettingsModel'

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5500'
const ALL_PROJECTS_URL = `${API_URL}/api/project`
const CREATE_PROJECT_URL = `${API_URL}/api/project/createProject`
const DELETE_PROJECT_URL = `${API_URL}/api/project/deleteProject`
const UPDATE_PROJECT_URL = `${API_URL}/api/project/updateProject`
const SPECIFIC_PROJECT_URL = `${API_URL}/api/project`
const UPLOAD_CONTRACT_URL = `${API_URL}/api/user/uploadContract`
const GET_USER_DOCUMENTS_URL = `${API_URL}/api/user/getDocuments`
const UPDATE_DOCUMENT_USER_STATUS_URL = `${API_URL}/api/user/updateDocument`
const UPLOAD_USER_DOCUMENTS_URL = `${API_URL}/api/user/uploadDocuments`

function* uploadContract({payload}: IContract | any): any {
  try {
    console.log('dkdghas')
    const formData = new FormData()

    formData.append('name', payload?.contract.name)
    formData.append('userId', payload?.contract.userId)
    formData.append('contract', payload?.contract.file)
    const response = yield axios.post(UPLOAD_CONTRACT_URL, formData, {
      headers: {
        accept: 'application/json',
        'Accept-Language': 'en-US,en;q=0.8',
        'Content-Type': `multipart/form-data; boundary=${payload._boundary}`,
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    })
    if (response.data) {
      toast.success('Contract Uploaded')
    }
    console.log('dkd api called')
    yield put({type: CONTRACT_UPLOAD_RES, payload: 'Contract Uploaded'})
  } catch (error: any) {
    toast.error(error?.response?.data.message)
    yield put({type: CONTRACT_UPLOAD_RES, payload: error?.response?.data.message})
  }
}
function* uploadUserDocuments({payload}: IUserDocuments | any): any {
  try {
    console.log(payload?.userDocuments, 'dkdjasswsss')
    // const formData = new FormData()
    const formData = new FormData()

    formData.append('userId', payload?.userDocuments?.userId)
    // formData.append('projectInfo', payload.project.projectInfo)
    // formData.append('projectCompensation', payload.project.projectCompensation)
    // formData.append('userIds', JSON.stringify(payload.project.projectTeam))
    if (payload?.userDocuments?.contract)
      formData.append('contract', payload?.userDocuments?.contract)
    if (payload?.userDocuments?.idFront) formData.append('idFront', payload?.userDocuments?.idFront)
    if (payload?.userDocuments?.idBack) formData.append('idBack', payload?.userDocuments?.idBack)
    if (payload?.userDocuments?.selfie) formData.append('selfie', payload?.userDocuments?.selfie)

    yield axios.post(UPLOAD_USER_DOCUMENTS_URL, formData, {
      // headers: {
      //   accept: 'application/json',
      //   'Accept-Language': 'en-US,en;q=0.8',
      //   'Content-Type': `multipart/form-data; boundary=${payload._boundary}`,
      //   Authorization: `Bearer ${localStorage.getItem('token')}`,
      // },
    })
    console.log('dkd api called')
    yield put({type: CONTRACT_UPLOAD_RES, payload: 'Contract Uploaded'})
  } catch (error: any) {
    toast.error(error?.response?.data?.message)
    yield put({type: CONTRACT_UPLOAD_RES, payload: false})
  }
}


// function* getUserDocuments1({payload}: any): any {
//   try {
//     console.log('Im in try')
//     const res = yield axios.get(`${GET_USER_DOCUMENTS_URL}?userId=${payload.userId}`)
//     yield put({type: GET_USER_DOCUMENTS, payload: res?.data})
//   } catch (error) {
//     console.log('Im in error', error)
//     yield put({type: GET_USER_DOCUMENTS, payload: false})
//   }
// }
// function* getUserDocuments({payload}: any): any {
//   try {
//     console.log('payloadddd', payload)
//     const res = yield axios.get(`${GET_USER_DOCUMENTS_URL}?userId=${payload.payload}`)
//     console.log(res, 'payloadddd')
//     yield {type: GET_USER_DOCUMENTS, payload: res.data}
//   } catch (error) {
//     yield {type: GET_USER_DOCUMENTS, payload: false}
//   }
// }

function* getUserDocuments({payload}: any): any {
  try {
    const res = yield axios.get(`${GET_USER_DOCUMENTS_URL}?userId=${payload.payload}`)
    yield put({type: GET_USER_DOCUMENTS_SUCCESS, payload: res.data})
  } catch (error) {
    yield put({type: GET_USER_DOCUMENTS_FAILURE, payload: error})
  }
}
function* UpdateUserDocsStatus({payload}: IUpdateStatus | any): any {
  try {
    const response = yield axios.put(UPDATE_DOCUMENT_USER_STATUS_URL, payload?.updatedStatus, {
      headers: {
        accept: 'application/json',
        'Accept-Language': 'en-US,en;q=0.8',
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    })
    if (response.data) {
      toast.success('Status updated')
    }
    yield put({
      type: UPDATE_DOCUMENT_USER_STATUS_SUCCESS,
      payload: 'Status updated',
    })
  } catch (error) {
    toast.error('Something went wrong!')
    yield put({type: UPDATE_DOCUMENT_USER_STATUS_FAILURE, payload: error})
  }
}

// function* deleteProject(action: any): any {
//   try {
//     yield axios.delete(`${DELETE_PROJECT_URL}/${action.payload}`)
//     yield put({type: DELETE_PROJECT_RES, payload: 'Project Deleted'})
//     yield getallProjects()
//   } catch (error) {
//     yield put({type: DELETE_PROJECT_RES, payload: false})
//   }
// }

// function* updateProject({payload}: any): any {
//   try {
//     // yield axios.put(`${UPDATE_PROJECT_URL}/${action.payload.project.id}`, action.payload.project)
//     const formData = new FormData()

//     formData.append('image', payload.project.image)
//     formData.append('projectName', payload.project.projectName)
//     formData.append('projectInfo', payload.project.projectInfo)
//     formData.append('projectCompensation', payload.project.projectCompensation)
//     yield axios.put(`${UPDATE_PROJECT_URL}/${payload.project.id}`, formData, {
//       headers: {
//         accept: 'application/json',
//         'Accept-Language': 'en-US,en;q=0.8',
//         'Content-Type': `multipart/form-data; boundary=${payload._boundary}`,
//       },
//     })
//     yield put({type: UPDATE_SPECIFIC_RES, payload: 'Project Updated'})
//     yield payload.history.push('/Projects')
//     // yield action.payload.history.push("/Projects")
//   } catch (error) {
//     yield put({type: UPDATE_SPECIFIC_RES, payload: false})
//   }
// }

// function* getSpecificProject(action: any): any {
//   try {
//     const res = yield axios.get(`${SPECIFIC_PROJECT_URL}/${action.payload}`)
//     yield put({type: GET_SPECIFIC_PROJECT_RES, payload: res.data})
//   } catch (error) {
//     yield put({type: GET_SPECIFIC_PROJECT_RES, payload: null})
//   }
// }

export function* userContractSaga() {
  console.log('dkd im in docs saga')
  // yield takeEvery(GET_All_PROJECTS, getallProjects)
  // yield takeEvery(CREATE_PROJECT, createProject)
  // yield takeEvery(UPDATE_SPECIFIC_PROJECT, updateProject)
  // yield takeEvery(GET_SPECIFIC_PROJECT, getSpecificProject)
  // yield takeEvery(DELETE_PROJECT, deleteProject)
  yield takeEvery(UPLOAD_USER_CONTRACT, uploadContract)
  yield takeEvery(GET_USER_DOCUMENTS, getUserDocuments)
  yield takeEvery(UPDATE_DOCUMENT_USER_STATUS, UpdateUserDocsStatus)
  yield takeEvery(UPLOAD_USER_DOCUMENTS, uploadUserDocuments)
}

export default userContractSaga
