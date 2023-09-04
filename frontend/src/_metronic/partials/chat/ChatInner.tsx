/* eslint-disable jsx-a11y/anchor-is-valid */
import {ChangeEvent, FC, useEffect, useRef, useState} from 'react'
import {User, UserRoleEnum} from '../../helpers/userData'
import {useConnection} from '../../../app/modules/apps/chat/components/socketContext'
import {shallowEqual, useSelector} from 'react-redux'
import {RootState} from '../../../setup/redux/RootReducer'
import {UserModel} from '../../../app/modules/auth/models/UserModel'
import {MessageLeft, MessageRight} from './Message'
import React from 'react'

type Props = {
  user: User
  selectedIds: string[]
  projectName: any
}
const ChatInner: FC<Props> = ({user, selectedIds, projectName}) => {
  const currentUser: UserModel = useSelector<RootState>(
    ({auth}) => auth.user,
    shallowEqual
  ) as UserModel
  const {
    incomingMessage,
    socket,
    sendMessageToUser,
    setCurrentSelectedUser,
    sendMessageToGroup,
    realTimeMessage,
  } = useConnection()
  const [file, setFile] = useState<File | null>()
  const [message, setMessage] = useState<string>('')
  const inputRef = useRef<HTMLInputElement | null>(null)
  setCurrentSelectedUser(user)
  localStorage.setItem('latestOpenedUserId', user?.id as string)

  const onEnterPress = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.keyCode === 13 && e.shiftKey === false) {
      e.preventDefault()
      sendMessageToUser(user, file, message)
      setMessage('')
      handleRemoveFile()
    }
  }

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) {
      return
    }
    setFile(e.target.files[0])
    inputRef.current?.click()
  }

  const handleRemoveFile = () => {
    setFile(null)
    if (inputRef?.current) {
      inputRef.current.value = ''
    }
  }
  return (
    <div>
      {currentUser.role === UserRoleEnum.ADMIN ? (
        <div>
          {projectName ? (
            realTimeMessage?.map(
              (message, index) =>
                message.sender === currentUser.id && (
                  <MessageRight
                    key={index}
                    message={message.content}
                    displayName={currentUser.firstName}
                    file={message.file}
                    fileName={message.fileName}
                  />
                )
            )
          ) : incomingMessage?.length > 0 ? (
            incomingMessage.map((message, index) =>
              message.sender === currentUser.id ? (
                <MessageRight
                  key={index}
                  message={message.content}
                  displayName={currentUser.firstName}
                  file={message.file}
                  fileName={message.fileName}
                />
              ) : (
                <MessageLeft
                  key={index}
                  message={message.content}
                  displayName={user.firstName}
                  file={message.file}
                  fileName={message.fileName}
                />
              )
            )
          ) : (
            <h4 className='text-center my-5'>Keine anzuzeigenden Nachrichten.</h4>
          )}
        </div>
      ) : (
        <div>
          {incomingMessage.length > 0 ? (
            incomingMessage.map((message, index) =>
              message.sender === currentUser.id ? (
                <MessageRight
                  key={index}
                  message={message.content}
                  file={message.file}
                  fileName={message.fileName}
                  displayName={currentUser.firstName}
                />
              ) : (
                <MessageLeft
                  key={index}
                  message={message.content}
                  displayName={user.firstName}
                  file={message.file}
                  fileName={message.fileName}
                />
              )
            )
          ) : (
            <h4 className='text-center my-5'>Keine anzuzeigenden Nachrichten.</h4>
          )}
        </div>
      )}
      <div className='card-footer pt-4'>
        <textarea
          className='form-control form-control-flush mb-3'
          rows={1}
          data-kt-element='input'
          placeholder='Nachricht schreiben'
          value={message}
          onChange={(e) => {
            setMessage(e.target.value)
          }}
          onKeyDown={onEnterPress}
          style={{resize: 'none'}}
        ></textarea>
        <label className='btn btn-secondary'>
          <i className='fa fa-paperclip mr-1' />
          <input
            type='file'
            accept='application/pdf'
            style={{display: 'none'}}
            onChange={handleFileChange}
            ref={inputRef}
          />
        </label>
        <button
          className='btn btn-primary mx-4'
          type='button'
          data-kt-element='send'
          onClick={() => {
            selectedIds?.length > 0
              ? sendMessageToGroup(file, message, selectedIds)
              : sendMessageToUser(user, file, message)
            setMessage('')
            handleRemoveFile()
          }}
        >
          Senden
        </button>
        {file && (
          <div
            style={{display: 'flex', alignItems: 'center', backgroundColor: '#f1faff'}}
            className='mt-2 pt-3'
          >
            <p style={{marginRight: '10px', paddingLeft: '10px'}}>{file.name}</p>
            <i
              className='fa fa-times mb-5 text-danger'
              style={{cursor: 'pointer'}}
              onClick={handleRemoveFile}
            />
          </div>
        )}
      </div>
    </div>
  )
}
export {ChatInner}
