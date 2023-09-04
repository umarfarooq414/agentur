/* eslint-disable jsx-a11y/anchor-is-valid */
import { FC, useEffect, useRef, useState } from 'react'
import { KTSVG } from '../../../../../_metronic/helpers'
import { Dropdown1, ChatInner } from '../../../../../_metronic/partials'
import { useConnection } from './socketContext'
import { Message, User, UserRoleEnum } from '../../../../../_metronic/helpers/userData'
import { shallowEqual, useDispatch, useSelector } from 'react-redux'
import { RootState } from '../../../../../setup'
import { UserModel } from '../../../auth/models/UserModel'
import { useHistory, Link, useParams } from 'react-router-dom'
import * as auth from '../../../auth/redux/AuthRedux'
import { actions, actionTypes } from '../../../auth/redux/AuthRedux'
import style from './chat.module.css'
import { getAllProjects } from '../../../../pages/projects/redux/action'
import { useSelect } from '@mui/base'

const Private: FC = () => {
  // const messagesEndRef = useRef<HTMLDivElement>(null);
  const el = document.getElementById('kt_chat_messenger')

  const history = useHistory()
  const dispatch = useDispatch()
  const [selectedUser, setSelectedUser] = useState<User>()
  const [selectedId, setSelectedId] = useState<string>()

  const currentUser: UserModel = useSelector<RootState>(
    ({ auth }) => auth.user,
    shallowEqual
  ) as UserModel
  const {
    socket,
    getAllUsers,
    users,
    userCounts,
    userCount,
    // userChatTime,
    count,
    setCount,
    setUsers,
    setCurrentSelectedUser,
  } = useConnection()
  const [privateChatSocketMessage, setPrivateChatSocketMessage] = useState('')
  const [senderId, setSenderId] = useState('')
  const [search, setSearch] = useState(``)
  const [senderName, setSenderName] = useState('')
  const { userId } = useParams<{ userId: string }>()
  const [sortedUsersArr, setSortedUsersArr] = useState<any>()
  const [copyUsersArr, setCopyUsersArr] = useState<any>(users)
  let getProjectUsers: any = []
  socket.auth = currentUser
  async function getUsers() {
    return await getAllUsers()
  }

  const chatContainerRef = useRef<HTMLDivElement>(null)
  socket.on('receivedFromUser', (data: Message) => {
    const socketData = data.content
    const socketSenderID = data.sender.id
    const senderFirstName = data.sender.firstName

    setPrivateChatSocketMessage(socketData as any)
    setSenderId(socketSenderID as any)
    setSenderName(senderFirstName as any)
  })

  useEffect(() => {
    socket.emit('logoutNotification', currentUser?.id)
    // const latestOpenedUser = localStorage.getItem('latestOpenedUser')
    const latestOpenedUserId = localStorage.getItem('latestOpenedUserId')
    // let selectedUser = latestOpenedUser
    //   ? JSON.parse(latestOpenedUser)
    //   : users.length
    //     ? users[0]
    //     : null
    let selectedId = userId ?? latestOpenedUserId
    // latestOpenedUserId
    // ? JSON.parse(latestOpenedUserId)
    // : selectedUser
    //   ? selectedUser.id
    //   : null
    const selectedUser: any = users?.length > 0 ? users.find((u) => u.id === selectedId) : null
    setSelectedUser(selectedUser)
    setSelectedId(selectedId)
    if (selectedId) {
      history.push(`/apps/chat/private-chat/${selectedId}`)

      userCounts[selectedId as string] = 0
    }
    return () => {
      setCurrentSelectedUser(null)
    }
  }, [userId, users])
  if (el) {
    el.scrollTop = el.scrollHeight
  }

  useEffect(() => {
    getUsers()
  }, [])

  useEffect(() => {
    const desiredUserId = userId
    setSortedUsersArr([...users])

    sortedUsersArr?.sort((a: any, b: any) => {
      if (a.id === desiredUserId) return -1
      if (b.id === desiredUserId) return 1
      if (userCounts[a.id as string] > 0 && userCounts[b.id as string] > 0) return 0
      if (userCounts[a.id as string] > 0) return -1
      if (userCounts[b.id as string] > 0) return 1
      return 0
    })
  }, [users])

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight
    }
  }, [privateChatSocketMessage, selectedUser])
  useEffect(() => {
    // Scroll to the bottom of the chat container
    if (chatContainerRef.current) {
      // Scroll to the bottom of the chat container
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight
    }
  }, [selectedUser])

  useEffect(() => {
    socket.emit('acknowledge', { currentUser }, { selectedUser })
  }, [selectedUser])

  const handleUser = (user: User) => {
    setSelectedUser(user)
    localStorage.setItem('latestOpenedUser', JSON.stringify(user))
    localStorage.setItem('latestOpenedUserId', JSON.stringify(user.id))
    socket.emit('acknowledge', { currentUser }, { selectedUser })

    // const rearrangedUsersArr = sortedUsersArr.filter((u: any) => u.id !== user.id)
    // rearrangedUsersArr.unshift(user)
    // setSortedUsersArr([...rearrangedUsersArr])

    // Update the sortedUsersArr to keep the selected user in place
    const updatedUsersArr = sortedUsersArr.map((u: any) => (u.id === user.id ? user : u))
    setSortedUsersArr(updatedUsersArr)

    userCounts[selectedUser?.id as string] = 0
    userCounts[user.id as string] = 0
  }

  useEffect(() => {
    if (userCount) {
      Object.entries(userCount).forEach(([userId, data]: any) => {
        if (data?.count > 0) {
          userCounts[userId] = data.count
        } else {
          userCounts[userId] = 0
        }
      })
    }
  }, [userCount])

  const sortedUsers = [...users]
  const desiredUserId = userId

  sortedUsersArr?.sort((a: any, b: any) => {
    if (a.id === desiredUserId) return -1
    if (b.id === desiredUserId) return 1
    if (userCounts[a.id as string] > 0 && userCounts[b.id as string] > 0) return 0
    if (userCounts[a.id as string] > 0) return -1
    if (userCounts[b.id as string] > 0) return 1
    return 0
  })

  const [query, setQuery] = useState('')

  const allProjects = useSelector((state: RootState) => state?.Projects.allProjects)
  useEffect(() => {
    dispatch(getAllProjects())
  }, [])

  const [filterParam, setFilterParam] = useState<any>(['All'])
  const [projectName, setProjectName] = useState<any>()
  const [getusersArray, setGetUserArray] = useState<any>()

  const filterParamsData = (event: any) => {
    event.preventDefault()
    const selectedFilter = event.target.value
    setFilterParam(selectedFilter)
    if (selectedFilter === 'All') {
      getUsers()
      return
    } else {
      let filteredUsers: any[] = []
      for (let i = 0; i < allProjects?.length; i++) {
        filteredUsers.push(allProjects[i])
      }

      getProjectUsers =
        filteredUsers.length > 0
          ? filteredUsers?.filter(
            (userProjects: any) => userProjects?.projectName === selectedFilter
          )
          : users

      setUsers(getProjectUsers[0]?.users)
      setGetUserArray(getProjectUsers[0]?.users)
      setProjectName(getProjectUsers[0]?.projectName)
    }
  }

  const [selectedIds, setSelectedIds] = useState<string[]>([])

  const handleChange = (event: any) => {
    const value = event.target.value
    if (event.target.checked) {
      // Add the ID to the selectedIds array
      setSelectedIds((prevSelectedIds) => [...prevSelectedIds, value])
    } else {
      // Remove the ID from the selectedIds array
      setSelectedIds((prevSelectedIds) => prevSelectedIds.filter((id) => id !== value))
    }
  }
  console.log('selectedIds', selectedIds)

  return (
    <div className='d-flex flex-column flex-lg-row'>
      <div className='flex-column flex-lg-row-auto w-100 w-lg-300px w-xl-400px mb-10 mb-lg-0'>
        {users && (
          <div className='card card-flush'>
            <div className='card-header pt-7' id='kt_chat_contacts_header'>
              <form className='w-100 position-relative' autoComplete='off'>
                <div className={style.searchChat}>
                  <KTSVG
                    path='/media/icons/duotune/general/gen021.svg'
                    className='svg-icon-2 svg-icon-lg-1 svg-icon-gray-500 position-absolute top-50 ms-5 translate-middle-y'
                  />
                  <input
                    type='text'
                    className='form-control form-control-solid px-15'
                    name='search'
                    placeholder='Support durchsuchen...'
                    value={query}
                    onChange={(event) => setQuery(event.target.value)}
                  />
                </div>
                <select className={style.filterSec} value={filterParam} onChange={filterParamsData}>
                  <option value='All'>Select Projects</option>
                  {allProjects &&
                    allProjects.map((project: any) => (
                      <option key={project.id} value={project.projectName}>
                        {project.projectName}
                      </option>
                    ))}
                </select>
                {/* {not && not} */}
              </form>
            </div>
            <div className='card-body pt-5' id='kt_chat_contacts_body'>
              <div
                className='scroll-y me-n5 pe-5 h-200px h-lg-auto'
                data-kt-scroll='true'
                data-kt-scroll-activate='{default: false, lg: true}'
                data-kt-scroll-max-height='auto'
                data-kt-scroll-dependencies='#kt_header, #kt_toolbar, #kt_footer, #kt_chat_contacts_header'
                data-kt-scroll-wrappers='#kt_content, #kt_chat_contacts_body'
                data-kt-scroll-offset='0px'
              >
                {getusersArray?.length > 0 && <p>asd</p>}
                {sortedUsersArr
                  ?.filter((user: any) => {
                    if (query === '') {
                      return user
                    } else if (user.userName.toLowerCase().includes(query.toLowerCase())) {
                      return user
                    }
                  })
                  ?.map((user: User) => (
                    // userCounts[user.id as string] > 0 &&

                    <div key={user.id} onClick={() => handleUser(user)}>
                      <div
                        className={`d-flex flex-stack py-4 ${selectedUser?.id === user.id ? 'selected-user' : ''
                          }`}
                        style={{
                          color: '#fff',
                          backgroundColor: selectedUser?.id === user.id ? '#2b2b3f' : 'transparent',
                          borderRadius: '10px',
                          padding: '0px 5px',
                        }}
                      >
                        <div className='d-flex align-items-center'>
                          &nbsp;
                          {getusersArray?.length > 0 && (
                            <input
                              type='checkbox'
                              id={user?.id}
                              name={user?.userName}
                              value={user?.id}
                              onChange={handleChange}
                            ></input>
                          )}
                          &nbsp; &nbsp;
                          <div className='symbol symbol-45px symbol-circle'>
                            <span className='symbol-label bg-light-danger text-danger fs-6 fw-bolder'>
                              {/* {!!data && <p className='text-danger'>{'message ' + data.content} */}
                              {user.userName.charAt(0)}
                            </span>
                          </div>
                          <div className='ms-5'>
                            <>
                              <Link
                                to={`/apps/chat/private-chat/${user.id}`}
                                className='fs-5 fw-bolder text-gray-900 text-hover-primary mb-2'
                              >
                                {user.userName}
                                {selectedUser?.id !== user?.id &&
                                  userCounts[user?.id as string] > 0 && (
                                    <span
                                      className='badge badge-danger badge-circle badge-sm mx-2'
                                      style={{ backgroundColor: '#50cd89' }}
                                    ></span>
                                  )}
                              </Link>
                            </>

                            {user.role === UserRoleEnum.MEMBER &&
                              user.id === senderId &&
                              selectedUser?.id !== user?.id &&
                              userCounts[user.id as string] > 0 && (
                                // <div className='fw-bold text-gray-400'>{user.email}</div>
                                <div className='fw-bold text-gray-400'>
                                  {privateChatSocketMessage?.length > 30
                                    ? senderName +
                                    ' : ' +
                                    privateChatSocketMessage.substring(0, 30) +
                                    '...'
                                    : senderName + ' : ' + privateChatSocketMessage}
                                </div>
                              )}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {selectedUser ? (
        <div className='flex-lg-row-fluid ms-lg-7 ms-xl-10'>
          <div
            className='card'
            id='kt_chat_messenger'
            style={{
              height: '80vh',
              overflow: 'hidden',
              overflowY: 'scroll',
            }}
          >
            <div
              className='card-header'
              id='kt_chat_messenger_header'
              style={{ position: 'sticky', top: '0px', backgroundColor: '#222233', zIndex: '9' }}
            >
              <div className='card-title'>
                <div className='symbol-group symbol-hover'></div>
                <div className='d-flex justify-content-center flex-column me-3'>
                  <a
                    href='#'
                    className='fs-4 fw-bolder text-gray-900 text-hover-primary me-1 mb-2 lh-1'
                  >
                    {getusersArray?.length > 0 && projectName
                      ? projectName
                      : selectedUser?.userName}
                  </a>
                  <div className='mb-0 lh-1'>
                    <span className='badge badge-success badge-circle w-10px h-10px me-1'></span>
                    <span className='fs-7 fw-bold text-gray-400'>Active</span>
                  </div>
                </div>
              </div>
            </div>
            <ChatInner user={selectedUser} selectedIds={selectedIds} projectName={projectName} />
          </div>
        </div>
      ) : (
        <div className='' style={{ display: 'block', margin: 'auto' }}>
          <h4>Kein Benutzer ausgewählt</h4>
        </div>
      )}
    </div>
    // </>
  )
}
export { Private }
