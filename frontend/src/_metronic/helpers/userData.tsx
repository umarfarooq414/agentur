import {uuid} from 'uuidv4'

export enum UserRoleEnum {
  ADMIN = `ADMIN`,
  MEMBER = `MEMBER`,
}
export enum UserStatusEnum {
  INACTIVE = `INACTIVE`,
  ACTIVE = `ACTIVE`,
  DEACTIVATE = `DEACTIVATE`,
}
export interface User {
  id?: string
  userName: string
  firstName?: string
  lastName?: string
  email: string
  status?: UserStatusEnum
  role?: UserRoleEnum
}
export interface Message {
  sender?: User | any
  receiver?: User | any
  content?: string
  file?: any
  fileName?: string
  seen?: boolean
  globalCount?: number
  receiverGroup?: string[]
}

export interface IAnnouncement {
  sender?: User
  id?: string
  announcement?: string
  expiresAt?: Date
  createdAt?: Date
}
