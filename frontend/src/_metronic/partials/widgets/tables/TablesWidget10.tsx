import React, {useEffect} from 'react'
import {KTSVG} from '../../../helpers'
import {Link} from 'react-router-dom'
import {useDispatch, useSelector} from 'react-redux'
import {resetDeleteUser, updateStatusReset, UsersList} from './redux/usersAction'
import UpdateStatus from './UserStatus/updateStatus'
import {RootState} from '../../../../setup'
import {UserModel} from '../../../../app/modules/auth/models/UserModel'
import {toast} from 'react-toastify'

type Props = {
  className: string
}

const TablesWidget10: React.FC<Props> = ({className}) => {
  const dispatch = useDispatch()
  const userList = useSelector<RootState>(({user}) => user.users) as UserModel[]
  const userStatusUpdated = useSelector<RootState>(({user}) => user.userStatusUpdated) as any

  const {deletedUser} = useSelector<RootState>(({user}) => user) as any

  useEffect(() => {
    if (deletedUser?.length) {
      toast.success(deletedUser)
      dispatch(UsersList())
    }

    return () => {
      dispatch(resetDeleteUser())
    }
  }, [deletedUser])

  useEffect(() => {
    dispatch(UsersList())
  }, [])

  useEffect(() => {
    if (userStatusUpdated?.length) {
      toast.success(userStatusUpdated)
    } else if (userStatusUpdated === false) {
      toast.error('Something went wrong')
    }

    return () => {
      dispatch(updateStatusReset())
    }
  }, [userStatusUpdated])

  return (
    <div className={`card ${className}`}>
      <div className='card-body py-3'>
        <div className='table-responsive'>
          <>
            <table className='table table-row-dashed table-row-gray-300 align-middle gs-0 gy-4'>
              <thead>
                <tr className='fw-bolder text-muted'>
                  <th className='min-w-150px'>#</th>
                  <th className='min-w-150px'>Vorname</th>
                  <th className='min-w-150px'>Nachname</th>
                  <th className='min-w-140px'>E-mail</th>
                  <th className='min-w-120px'>Status</th>
                  <th className='min-w-100px text-end'>Aktions</th>
                </tr>
              </thead>
              <tbody>
                {userList && userList.length ? (
                  userList.map((user: any, idx: number) => (
                    <tr>
                      <td>
                        <div className='d-flex align-items-center'>
                          <div className='d-flex justify-content-start flex-column'>
                            <Link to={`${/user/}${user.id}`}>{+idx + 1}</Link>
                          </div>
                        </div>
                      </td>
                      <td>
                        <div className='d-flex align-items-center'>
                          <div className='d-flex justify-content-start flex-column'>
                            <Link
                              to={`${/user/}${user.id}`}
                              className='text-dark fw-bolder text-hover-primary fs-6'
                            >
                              {user.firstName}
                            </Link>
                          </div>
                        </div>
                      </td>
                      <td>
                        <Link
                          to={`${/user/}${user.id}`}
                          className='text-dark fw-bolder text-hover-primary d-block fs-6'
                        >
                          {user.lastName}
                        </Link>
                      </td>
                      <td className='text-end'>
                        <div className='d-flex flex-column w-100 me-2'>
                          <div className='d-flex flex-stack mb-2'>
                            <span className='text-muted me-2 fs-7 fw-bold'>{user.email}</span>
                          </div>
                        </div>
                      </td>
                      <td>
                        <div>
                          <div>
                            <div className='user_status' id={user.status}>
                              {user.status}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td>
                        <div className='d-flex justify-content-end flex-shrink-0'>
                          {/* <div className='user_status' id={user.status}>
                            {user.status}
                          </div> */}

                          <Link
                            to={`/admin-verify-docs?${user.id}`}
                            className='btn btn-icon btn-bg-light btn-active-color-primary btn-sm me-1'
                            onClick={() => {
                              localStorage.setItem('selectedUser', JSON.stringify(user))
                              localStorage.setItem('selectedUserId', JSON.stringify(user.id))
                            }}
                          >
                            <KTSVG
                              path='/media/icons/duotune/art/documentsIcon.svg'
                              className='svg-icon-3'
                            />
                          </Link>
                          <Link
                            to={`/apps/chat/private-chat/${user.id}`}
                            className='btn btn-icon btn-bg-light btn-active-color-primary btn-sm me-1'
                            onClick={() => {
                              localStorage.setItem('latestOpenedUser', JSON.stringify(user))
                              localStorage.setItem('latestOpenedUserId', JSON.stringify(user.id))
                            }}
                          >
                            <KTSVG
                              path='/media/icons/duotune/art/chat.svg'
                              className='svg-icon-3'
                            />
                          </Link>

                          <UpdateStatus userId={user.id} status={user.status} />

                          {/* <Link
                            to='/UploadProjects'
                            className='btn btn-icon btn-bg-light btn-active-color-primary btn-sm me-1'
                          >
                            <KTSVG
                              path='/media/icons/duotune/art/uploadProject.svg'
                              className='svg-icon-3'
                            />
                          </Link> */}
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={6}>
                      {/* TODO: place this in the center */}
                      No User Found!
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </>
        </div>
      </div>
    </div>
  )
}
export {TablesWidget10}
