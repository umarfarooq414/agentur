import {SetStateAction, createContext, useContext, useEffect, useMemo, useState} from 'react'
import {shallowEqual, useDispatch, useSelector} from 'react-redux'
import {io, Socket} from 'socket.io-client'
import {RootState} from '../../../../../setup/redux/RootReducer'
import {UserModel, UserRoleEnum} from '../../../auth/models/UserModel'
import {IAnnouncement, Message, User} from '../../../../../_metronic/helpers/userData'
import {uuid} from 'uuidv4'
import {
  getActiveAnnouncemnets,
  getActiveUsers,
  getAdmin,
  getAdminChats,
  getMessageCount,
  getUserChat,
  getUsers,
} from '../../../auth/redux/AuthCRUD'
import * as auth from '../../../auth/redux/AuthRedux'
import {toast} from 'react-toastify'
import {connect} from 'http2'
const SOCKET_URL = process.env.SOCKET_IO_URL || 'http://localhost:3001'
const ConnectionContext = createContext<IConnectionContext>({} as IConnectionContext)
interface IConnectionContext {
  incomingMessage: Message[]
  setIncomingMessage: React.Dispatch<React.SetStateAction<Message[]>>

  realTimeMessage: Message[]
  setRealTimeMessage: React.Dispatch<React.SetStateAction<Message[]>>

  count: number
  setCount: React.Dispatch<React.SetStateAction<number>>
  socket: Socket
  users: User[]
  setUsers: React.Dispatch<React.SetStateAction<User[]>>
  currentSelectedUser: User | null
  setCurrentSelectedUser: React.Dispatch<React.SetStateAction<User | null>>
  getAdminMessages: Function
  getAllUsers: Function
  sendMessageToUser: Function
  sendAnnouncement: Function
  receiveAnnouncement: Function
  infoData: IAnnouncement[]
  setInfoData: React.Dispatch<React.SetStateAction<IAnnouncement[]>>
  getAnnouncements: Function
  getUserMessages: Function
  getLogoutNotifcation: Function
  userCounts: any
  userCount: any
  setUserCount: React.Dispatch<React.SetStateAction<any>>
  privateChatSocketMessage: INotification[]
  setPrivateChatSocketMessage: React.Dispatch<React.SetStateAction<INotification[]>>
  sendMessageToGroup: Function
}
interface INotification {
  message: string
  senderId: string
  senderName: string
  fileName: string
}
export const ConnectionProvider = (props: any) => {
  const [incomingMessage, setIncomingMessage] = useState<Message[]>([])
  const [realTimeMessage, setRealTimeMessage] = useState<Message[]>([])
  const [users, setUsers] = useState<User[]>([])
  const [userChatTime, setUserChatTime] = useState()
  const [currentSelectedUser, setCurrentSelectedUser] = useState<User | null>(null)
  let [count, setCount] = useState(0)
  const [nCount, setNCount] = useState<any>()
  const [userCount, setUserCount] = useState<any>()
  const [privateChatSocketMessage, setPrivateChatSocketMessage] = useState<INotification[]>([])
  const userCounts: any = {}

  const currentUser: UserModel = useSelector<RootState>(
    ({auth}) => auth.user,
    shallowEqual
  ) as UserModel
  // const currentUser: UserModel = useSelector<RootState>(({ auth }) => auth.user, shallowEqual) as UserModel

  const access_token = useSelector<RootState>((state) => state.auth.access_token)
  const {role} = currentUser
  const [infoData, setInfoData] = useState<IAnnouncement[]>([])
  const socket: Socket = useMemo(() => {
    const socket = io(`${SOCKET_URL}/${role}`, {transports: ['websocket']})
    socket.auth = currentUser
    return socket
  }, [])

  async function getAllUsers() {
    if (role === UserRoleEnum.ADMIN) {
      const res = await getActiveUsers()
      const user: User[] = res?.data
      setUsers(user)
    }
    if (role === UserRoleEnum.MEMBER) {
      const res = await getAdmin(access_token as string)
      const user = res.data
      setUsers(user)
    }
  }
  async function getLogoutNotifcation() {
    const res: [] = await getUserMessages(currentUser)
    const unseen = res.filter((user: any) => user?.seen === false)
    if (unseen.length > 0) {
      toast.success('neue unsichtbare Nachricht')
    }
  }
  const getAdminMessages = async (user: User) => {
    const res = await getAdminChats(user?.id as string)
    return await res.data
  }
  const getPopups = async (data: any) => {
    let res
    setCount(data?.length)
    const senderIds = data?.map((item: any) => item.sender)
    if (currentUser.role === UserRoleEnum.ADMIN) {
      res = await getActiveUsers()
    }
    if (currentUser.role === UserRoleEnum.MEMBER) {
      res = await getAdmin(access_token as string)
    }
    const users = res?.data
    const userNames = senderIds?.map((senderId: any) => {
      const user = users?.find((item: any) => item.id === senderId)
      return user ? user.userName : null
    })
    let privateChat = [...privateChatSocketMessage]
    data?.forEach((chat: any) => {
      const socketData = chat?.message
      const socketSenderID = chat?.sender
      const socketFileName = chat?.fileName
      if ((socketData || socketFileName) && socketSenderID) {
        const senderName = userNames[senderIds.indexOf(socketSenderID)]
        privateChat = [
          ...privateChat.filter((m) => m.senderId !== socketSenderID),
          {
            message: socketData,
            senderId: socketSenderID,
            senderName: senderName,
            fileName: socketFileName,
          },
        ]
      }
    })
    setPrivateChatSocketMessage(privateChat)
  }

  const getUserMessages = async (user: User) => {
    const res = await getUserChat(user?.id as string)
    setUserChatTime(res.data)
    return await res.data
  }

  useEffect(() => {
    socket.emit('unseenMessageCount', currentUser?.id)
    socket.emit('logoutNotification', currentUser?.id)
    socket.on('unseenMessageCount', (data) => {
      setUserCount(data)
    })

    if (role === UserRoleEnum.ADMIN) {
      setSenderReceiver()
      adminFunctionality()
    }
    if (role === UserRoleEnum.MEMBER) {
      setSenderReceiver()
      userFunctionality()
      anouncement()
    }
    return () => {
      socket.off('connect')
      socket.off('sendMessageToUser')
      socket.off('sendMessageToGroup')
      socket.off('receivedFromUser')
      socket.off('sendMessageToAdmin')
      socket.off('receivedFromAdmin')
      socket.off('sendAnnouncement')
      socket.off('receivedAnnouncement')
      socket.off('updateUsersList')
      socket.off('acknowledge')
      setIncomingMessage([])
      setInfoData([])
    }
  }, [currentSelectedUser])
  useEffect(() => {
    socket.on('logoutNotification', getPopups)
  }, [])

  function adminFunctionality() {
    socket.on('updateUsersList', (data) => {
      setUsers(data)
    })
    socket.on('receivedFromUser', (data: Message) => {
      socket.emit('unseenMessageCount', currentUser?.id)

      const msg = {
        sender: currentSelectedUser?.id,
        receiver: currentUser.id,
        content: data.content,
        file: data.file,
        fileName: data.fileName,
        seen: data?.seen,
        globalCount: data?.globalCount,
      }
      if (currentSelectedUser?.id === data?.sender?.id) {
        if (currentUser?.id === data?.receiver?.id) {
          setIncomingMessage((msgs) => [...msgs, msg])
          socket.emit('acknowledge', {currentUser}, {currentSelectedUser})
          setCount(0)
        }
      } else {
        if (msg.seen === false) {
          socket.emit('logoutNotification', currentUser?.id)
          if (currentUser?.id === data?.receiver?.id) {
            toast.success('neue unsichtbare Nachricht')
          }
        }
      }
    })
    socket.on('sendMessageToUser', (data: Message) => {
      const msg = {
        sender: currentUser.id,
        receiver: currentSelectedUser?.id,
        content: data.content,
        file: data.file,
        fileName: data.fileName,
      }
      setIncomingMessage((msgs) => [...msgs, msg])
    })
    socket.on('sendMessageToGroup', (data: Message) => {
      const msg = {
        sender: currentUser.id,
        content: data.content,
        file: data.file,
        fileName: data.fileName,
      }
      setRealTimeMessage((msgs) => [...msgs, msg])
    })
    // socket.on('sendMessageToGroup', (data: Message) => {
    //   const msg = {
    //     sender: currentUser.id,
    //     receiver: currentSelectedUser?.id,
    //     content: data.content,
    //     file: data.file,
    //     fileName: data.fileName,
    //   }
    //   setIncomingMessage((msgs) => [...msgs, msg])
    // })
  }

  function userFunctionality() {
    socket.on('receivedFromAdmin', (data: Message) => {
      socket.emit('unseenMessageCount', currentUser?.id)
      const msg = {
        sender: currentSelectedUser?.id,
        receiver: currentUser.id,
        content: data.content,
        file: data.file,
        fileName: data.fileName,
        seen: data?.seen,
        globalCount: data?.globalCount,
      }
      if (currentSelectedUser?.id === data?.sender?.id) {
        setIncomingMessage((msgs) => [...msgs, msg])
        socket.emit('acknowledge', {currentUser}, {currentSelectedUser})
        setCount(0)
      } else {
        if (msg.seen === false) {
          socket.emit('logoutNotification', currentUser?.id)
          toast.success('neue unsichtbare Nachricht')
        }
      }
    })
    socket.on('sendMessageToAdmin', (data: Message) => {
      const msg = {
        sender: currentUser.id,
        receiver: currentSelectedUser?.id,
        content: data.content,
        file: data.file,
        fileName: data.fileName,
      }
      setIncomingMessage((msgs) => [...msgs, msg])
    })
  }

  const sendMessageToUser = (user: User, file: File, message: string) => {
    if (message.length !== 0 || file) {
      const data: Message = {
        sender: currentUser,
        receiver: user,
        content: message,
        file,
        fileName: file?.name,
        seen: false,
      }
      if (role === UserRoleEnum.ADMIN) {
        socket.emit('sendMessageToUser', data)
      }
      if (role === UserRoleEnum.MEMBER) {
        socket.emit('sendMessageToAdmin', data)
      }
    }
  }

  const sendMessageToGroup = (file: File, message: string, group?: string[]) => {
    if (message.length !== 0 || file) {
      const data: Message = {
        sender: currentUser.id,
        // receiver: user,
        receiverGroup: group,
        content: message,
        file,
        fileName: file?.name,
        seen: false,
      }
      if (role === UserRoleEnum.ADMIN) {
        socket.emit('sendMessageToGroup', data)
      }
    }
  }

  async function anouncement() {
    socket.on('receivedAnnouncement', (data: IAnnouncement) => {
      toast.success('new announcement')
    })
  }

  async function setSenderReceiver() {
    const data: any = await getAdminMessages(currentSelectedUser as User)
    const messages = data
      ?.map((info: any) => {
        if (info.sender === currentUser.id) {
          const newmsg: any = {
            sender: info.sender,
            receiver: info.receiver,
            content: info.message,
            file: info.file,
            fileName: info.fileName,
          }
          return newmsg
        } else if (info.receiver === currentUser.id) {
          const newmsg: any = {
            sender: info.sender,
            receiver: info.receiver,
            content: info.message,
            file: info.file,
            fileName: info.fileName,
          }
          return newmsg
        } else {
          return null
        }
      })
      ?.filter((msg: any) => msg !== null)
    setIncomingMessage(messages)
  }

  async function getAnnouncements() {
    const res = await getActiveAnnouncemnets()
    setInfoData(res.data)
  }

  function sendAnnouncement(data: IAnnouncement) {
    if (currentUser.role === UserRoleEnum.ADMIN) {
      data.id = uuid()
      const newAnnouncement = {...data} // add a new id to the announcement object
      socket.emit('sendAnnouncement', newAnnouncement)
      setInfoData((prev: any) => [...prev, newAnnouncement]) // add the new announcement to the state
    }
  }

  function receiveAnnouncement() {
    socket.on('receivedAnnouncement', (data: IAnnouncement) => {
      // toast.success('new announcement')
      setInfoData((prev: any) => [...prev, data])
    })
  }

  const value: IConnectionContext = {
    incomingMessage,
    setIncomingMessage,
    count,
    setCount,
    socket,
    getAdminMessages,
    getAllUsers,
    users,
    setUsers,
    sendMessageToUser,
    currentSelectedUser: currentSelectedUser,
    setCurrentSelectedUser: setCurrentSelectedUser,
    sendAnnouncement,
    receiveAnnouncement,
    setInfoData,
    infoData,
    getAnnouncements,
    getUserMessages,
    getLogoutNotifcation,
    userCounts,
    userCount,
    setUserCount,
    privateChatSocketMessage,
    setPrivateChatSocketMessage,
    sendMessageToGroup,
    setRealTimeMessage,
    realTimeMessage,
  }
  return (
    <>
      <ConnectionContext.Provider value={value} {...props} />
    </>
  )
}
export const useConnection = (): IConnectionContext => {
  const context = useContext(ConnectionContext)
  if (!context) {
    throw new Error('useConnection must be used within a ConnectionProvider')
  }
  return context
}
