import axios from 'axios'
import {takeEvery, put} from 'redux-saga/effects'

import {
  GET_All_PROJECTS,
  All_PROJECTS_DATA,
  CREATE_PROJECT,
  PROJECT_CREATED_RES,
  DELETE_PROJECT,
  DELETE_PROJECT_RES,
  UPDATE_SPECIFIC_RES,
  UPDATE_SPECIFIC_PROJECT,
  GET_SPECIFIC_PROJECT,
  GET_SPECIFIC_PROJECT_RES,
} from './Projectsconstant'

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5500'
const ALL_PROJECTS_URL = `${API_URL}/api/project`
const CREATE_PROJECT_URL = `${API_URL}/api/project/createProject`
const DELETE_PROJECT_URL = `${API_URL}/api/project/deleteProject`
const UPDATE_PROJECT_URL = `${API_URL}/api/project/updateProject`
const SPECIFIC_PROJECT_URL = `${API_URL}/api/project`

function* createProject({payload}: any): any {
  try {
    const formData = new FormData()

    formData.append('image', payload.project.image)
    formData.append('projectName', payload.project.projectName)
    formData.append('projectInfo', payload.project.projectInfo)
    formData.append('projectCompensation', payload.project.projectCompensation)
    formData.append('userIds', JSON.stringify(payload.project.projectTeam))
    yield axios.post(CREATE_PROJECT_URL, formData, {
      headers: {
        accept: 'application/json',
        'Accept-Language': 'en-US,en;q=0.8',
        'Content-Type': `multipart/form-data; boundary=${payload._boundary}`,
      },
    })
    yield put({type: PROJECT_CREATED_RES, payload: 'Project Created'})
    yield payload.history.push('/Projects')
  } catch (error) {
    yield put({type: PROJECT_CREATED_RES, payload: false})
  }
}

function* getallProjects(): any {
  try {
    const res = yield axios.get(ALL_PROJECTS_URL)
    yield put({type: All_PROJECTS_DATA, payload: res?.data})
  } catch (error) {
    yield put({type: All_PROJECTS_DATA, payload: []})
  }
}

function* deleteProject(action: any): any {
  try {
    yield axios.delete(`${DELETE_PROJECT_URL}/${action.payload}`)
    yield put({type: DELETE_PROJECT_RES, payload: 'Project Deleted'})
    yield getallProjects()
  } catch (error) {
    yield put({type: DELETE_PROJECT_RES, payload: false})
  }
}

function* updateProject({payload}: any): any {
  try {
    // yield axios.put(`${UPDATE_PROJECT_URL}/${action.payload.project.id}`, action.payload.project)
    const formData = new FormData()

    formData.append('image', payload.project.image)
    formData.append('projectName', payload.project.projectName)
    formData.append('projectInfo', payload.project.projectInfo)
    formData.append('projectCompensation', payload.project.projectCompensation)
    yield axios.put(`${UPDATE_PROJECT_URL}/${payload.project.id}`, formData, {
      headers: {
        accept: 'application/json',
        'Accept-Language': 'en-US,en;q=0.8',
        'Content-Type': `multipart/form-data; boundary=${payload._boundary}`,
      },
    })
    yield put({type: UPDATE_SPECIFIC_RES, payload: 'Project Updated'})
    yield payload.history.push('/Projects')
    // yield action.payload.history.push("/Projects")
  } catch (error) {
    yield put({type: UPDATE_SPECIFIC_RES, payload: false})
  }
}

function* getSpecificProject(action: any): any {
  try {
    const res = yield axios.get(`${SPECIFIC_PROJECT_URL}/${action.payload}`)
    yield put({type: GET_SPECIFIC_PROJECT_RES, payload: res.data})
  } catch (error) {
    yield put({type: GET_SPECIFIC_PROJECT_RES, payload: null})
  }
}

export function* projectsSaga() {
  yield takeEvery(GET_All_PROJECTS, getallProjects)
  yield takeEvery(CREATE_PROJECT, createProject)
  yield takeEvery(UPDATE_SPECIFIC_PROJECT, updateProject)
  yield takeEvery(GET_SPECIFIC_PROJECT, getSpecificProject)
  yield takeEvery(DELETE_PROJECT, deleteProject)
}

export default projectsSaga
