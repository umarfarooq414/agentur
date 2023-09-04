import axios from 'axios'
import {AuthModel} from '../models/AuthModel'
import {UserModel, UserRoleEnum} from '../models/UserModel'
import { useSelector } from 'react-redux';
import { RootState } from '../../../../setup';
const API_URL = process.env.REACT_APP_API_URL || 'api'
const USERS_URL = `${API_URL}/api/user`

const CHATS_URL = `${API_URL}/api/chats`
export const GET_USER_BY_access_token_URL = `${API_URL}/api/user/user-by-token`
export const LOGIN_URL = `${API_URL}/api/auth/login`
export const REGISTER_URL = `${API_URL}/api/auth/register`
export const REQUEST_OTP_URL = `${API_URL}/api/auth/forget`
export const VERIFY_OTP_URL = `${API_URL}/api/auth/verify-otp`
export const RESET_PASSWORD_URL = `${API_URL}/api/auth/reset`
export const SOCIAL_LOGIN_URL = `${API_URL}/api/auth/social-login`
export const GET_USER_MESSAGES_URL = `${CHATS_URL}/userChats`
export const GET_ADMIN_MESSAGES_URL = `${CHATS_URL}/adminChats`
export const GET_NOTIFICATIONS_URL = `${CHATS_URL}/notifications`
export const GET_ANNOUNCEMENTS_URL= `${CHATS_URL}/getAnnouncements`
export const GET_ACTIVE_USERS_URL= `${CHATS_URL}/user`
export const DELETE_ANNOUNCEMNET_URL= `${CHATS_URL}/deleteAnnouncement`
export const GET_USER_URL = `${USERS_URL}/id/:id`

async function fun(email: string, password: string) {
  const res = await axios.post(LOGIN_URL, {email, password})
}
export function login(email: string, password: string) {
  fun(email, password)
  return axios.post(LOGIN_URL, {email, password})
}

export async function socialLogin(access_token: string, provider: string) {
  return await axios.post(SOCIAL_LOGIN_URL, {
    accessToken: access_token,
    socialProvider: provider,
  })
}

export async function getUsers(access_token:string) {
  return await axios.get(USERS_URL,{
    headers:{
      access_token,
    }
  })
}

export async function getActiveUsers() {
    return await axios.get(GET_ACTIVE_USERS_URL)  
}

export async function getUser(id:string) {
  return await axios.get(GET_USER_URL,{
    params:{
      token:id
    }
  })
}

export async function getAdmin(access_token:string){
  return await axios.get(CHATS_URL,{
    headers:{
      access_token,
    }
  })
}

export async function getUserChats(access_token:string){
  return await axios.get(GET_USER_MESSAGES_URL,{
    headers:{
      access_token,
    }
  })
}

export async function getActiveAnnouncemnets(){
  return await axios.get(GET_ANNOUNCEMENTS_URL)
}

export async function getAdminChats(userId:string){
  return await axios.get(GET_ADMIN_MESSAGES_URL,{
    headers:{
      token:userId
    }
  })
}

export async function getUserChat(userId:string){
  return await axios.get(GET_USER_MESSAGES_URL,{
    headers:{
      token:userId
    }
  })
}

export async function deleteAdminAnnouncement(Id:string){
  return await axios.delete(DELETE_ANNOUNCEMNET_URL,{
    headers:{
      token:Id
    }
  })
}

export async function getMessageCount(userId:string){
  return await axios.get(GET_NOTIFICATIONS_URL,{
    headers:{
      token:userId
    }
  })
}


// Server should return AuthModel
export function register(
  email: string,
  userName: string,
  firstName: string,
  lastName: string,
  password: string
) {
  return axios.post<AuthModel>(REGISTER_URL, {
    email,
    userName,
    firstName,
    lastName,
    password,
  })
}
// Server should return object => { result: boolean } (Is Email in DB)
export function requestOTP(email: string) {
  return axios.post<{result: unknown}>(REQUEST_OTP_URL, {email})
}
export function verifyOtp(otp: number, email: string) {
  return axios.post<{result: unknown}>(VERIFY_OTP_URL, {otp, email})
}

export function resetPassword(password: string, access_token: string) {
  return axios.post<{result: unknown}>(
    RESET_PASSWORD_URL,
    {password},
    {
      headers: {
        Authorization: 'Bearer ' + access_token,
      },
    }
  )
}

export function getUserByToken() {
  return axios.get<UserModel>(GET_USER_BY_access_token_URL)
}
