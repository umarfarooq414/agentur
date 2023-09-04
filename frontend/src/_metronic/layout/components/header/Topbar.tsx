import clsx from 'clsx'
import {FC, useEffect, useState} from 'react'
import {KTSVG, messageFromClient, toAbsoluteUrl} from '../../../helpers'
import {HeaderNotificationsMenu, HeaderUserMenu, QuickLinks} from '../../../partials'
import {RootState} from '../../../../setup/redux/RootReducer'
import {shallowEqual, useDispatch, useSelector} from 'react-redux'
import * as auth from '../../../../app/modules/auth/redux/AuthRedux'
import {Link, useHistory} from 'react-router-dom'
import './style.css'
import {useConnection} from '../../../../app/modules/apps/chat/components/socketContext'
import {Message, User, UserRoleEnum} from '../../../helpers/userData'
import {getActiveUsers, getAdmin} from '../../../../app/modules/auth/redux/AuthCRUD'
import {UserModel} from '../../../../app/modules/auth/models/UserModel'
import {actions} from '../../../../app/modules/auth/redux/AuthRedux'

const toolbarButtonMarginClass = 'ms-1 ms-lg-3',
  toolbarButtonHeightClass = 'w-30px h-30px w-md-40px h-md-40px',
  toolbarUserAvatarHeightClass = 'symbol-30px symbol-md-40px',
  toolbarButtonIconSizeClass = 'svg-icon-1'

const Topbar: FC = () => {
  const [senderId, setSenderId] = useState('')
  const [chatPopUpBox, setChatPopUpBox] = useState(false)
  const currentUser: UserModel = useSelector<RootState>(
    ({auth}) => auth.user,
    shallowEqual
  ) as UserModel

  const dispatch = useDispatch()
  const {
    socket,
    users,
    count,
    setCount,
    userCount,
    userCounts,
    setPrivateChatSocketMessage,
    privateChatSocketMessage,
  } = useConnection()

  const style = {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    width: '50px',
    height: '50px',
    // backgroundColor: '#0d47a1',
    color: 'black',
    borderRadius: '25px',
    cursor: 'pointer',
  }

  const handleClick = () => {
    setTimeout(() => {
      setChatPopUpBox(!chatPopUpBox)
      setCount(0)
    }, 500)
  }
  if (userCount?.length > 0) {
    Object.entries(userCount).forEach(([id, data]: any) => {
      if (data?.count !== 0) {
        if (userCounts[data?.userId]) {
          userCounts[data?.userId]++
        } else {
          userCounts[data?.userId] = 1
        }
      }
    })
  }

  useEffect(() => {
    if (count > 0) {
      document.title = ` Agentur (${count} unsichtbare Nachricht)`
    }
    if (count === 0) {
      document.title = ` Agentur`
    }
  }, [count])

  return (
    <div className='d-flex align-items-stretch flex-shrink-0'>
      <div className={clsx('d-flex align-items-center', toolbarButtonMarginClass)}></div>
      <div className={clsx('d-flex align-items-center', toolbarButtonMarginClass)}>
        <QuickLinks />
      </div>

      <div className={clsx('d-flex align-items-center', toolbarButtonMarginClass)}>
        <div
          style={style}
          onClick={handleClick}
          className={clsx(
            'btn btn-icon btn-active-light-primary position-relative',
            // count > 0 ? 'animation-blink' : null,
            toolbarButtonHeightClass
          )}
          id='kt_drawer_chat_toggle'
        >
          {/* <Link
            to={`/apps/chat/private-chat/`}
            className='fs-5 fw-bolder text-gray-900 text-hover-primary mb-2'
          > */}
          <KTSVG
            path='/media/icons/duotune/communication/com012.svg'
            className={toolbarButtonIconSizeClass}
          />
          {/* <div className='fs-5 fw-bolder text-gray-900 text-hover-primary mb-2'> */}
          {count > 0 && <p className={`countBox${count > 0 ? ' animation-blink' : ''}`}>{''}</p>}

          {chatPopUpBox && (
            <div className='chatPopUpBox '>
              {privateChatSocketMessage.length > 0 ? (
                privateChatSocketMessage?.map((msg) => (
                  <ul>
                    {userCounts[msg.senderId as string] > 0 && chatPopUpBox && (
                      <li>
                        {/* <div key={msg.senderId} onClick={() => handleUser(user)}> */}
                        <div className=''>
                          <div className='symbol symbol-45px symbol-circle'>
                            <span className='symbol-label bg-light-danger text-danger fs-2 fw-bolder'>
                              {/* {!!data && <p className='text-danger'>{'message ' + data.content} */}
                              {msg.senderName.charAt(0)}
                              {/* {msg.senderName} */}
                            </span>
                          </div>
                          <Link
                            to={`/apps/chat/private-chat/${msg.senderId}`}
                            onClick={() => {
                              localStorage.setItem(
                                'latestOpenedUserId',
                                JSON.stringify(msg.senderId)
                              )
                            }}
                            className='fs-5 fw-bolder text-gray-900 text-hover-primary mb-2'
                          >
                            {msg.senderName}
                          </Link>
                          <div className='fw-bold text-gray-400'>
                            {msg?.message.length > 30
                              ? (msg?.message.substring(0, 30) as any) + '...'
                              : (msg.message as any)}
                          </div>
                          {msg?.fileName && (
                            <div className='fw-bold text-primary mx-20'>
                              {msg?.fileName.length > 30
                                ? ('pdf file' as any) + '...'
                                : (msg.fileName as any)}
                            </div>
                          )}
                        </div>
                      </li>
                    )}
                  </ul>
                ))
              ) : (
                <p
                  style={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    height: '100%',
                    background: '#1e1e2d',
                    border: '1px solid #014d84',
                    color: '#fff',
                    // boxShadow: '10px 10px 8px 10px #888888',
                  }}
                >
                  keine unsichtbare Nachricht
                </p>
              )}
            </div>
          )}

          {/* <KTSVG
            path='/media/icons/duotune/communication/com012.svg'
            className={toolbarButtonIconSizeClass}
          /> */}
          {/* {!!c &&  <p>{'' + `${c}`}</p>} */}
        </div>
        {/* <div
          className={clsx(
            'btn btn-icon btn-active-light-primary position-relative',
            toolbarButtonHeightClass
          )}
          id='kt_drawer_chat_toggle'
        >
          <KTSVG
            path='/media/icons/duotune/communication/com012.svg'
            className={toolbarButtonIconSizeClass}


          />{count && count}
           {/* {!!rCount && data && <p className='text-danger'>{'' + `${rCount} message from ${userName}`}</p>} */}
        {/* <span className='bullet bullet-dot bg-success h-6px w-6px position-absolute translate-middle top-0 start-50 animation-blink'></span> */}
        {/* </div> */}
        {/* </div> */}

        <div className={clsx('d-flex align-items-center', toolbarButtonMarginClass)}>
          <HeaderNotificationsMenu />
        </div>

        <div
          className={clsx('d-flex align-items-center', toolbarButtonMarginClass)}
          id='kt_header_user_menu_toggle'
        >
          <div
            className={clsx('cursor-pointer symbol', toolbarUserAvatarHeightClass)}
            data-kt-menu-trigger='click'
            data-kt-menu-attach='parent'
            data-kt-menu-placement='bottom-end'
            data-kt-menu-flip='bottom'
          >
            <img src={toAbsoluteUrl('/media/logos/img_logo.png')} alt='metronic' />
          </div>
          <HeaderUserMenu />
        </div>
      </div>
    </div>
  )
}

export {Topbar}
