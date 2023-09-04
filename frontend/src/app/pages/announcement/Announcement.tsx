import {useSelector, shallowEqual} from 'react-redux'
import {UserModel, UserRoleEnum} from '../../modules/auth/models/UserModel'
import {useConnection} from '../../modules/apps/chat/components/socketContext'
import {RootState} from '../../../setup'
import style from './style.module.css'
import {useEffect, useLayoutEffect, useState} from 'react'
import './expireDate.css'
import {IAnnouncement} from '../../../_metronic/helpers/userData'
import {deleteAdminAnnouncement} from '../../modules/auth/redux/AuthCRUD'
const Announcement = () => {
  const [currentAnnouncement, setCurrentAnnouncement] = useState('')
  const {socket, infoData, setInfoData, sendAnnouncement, receiveAnnouncement, getAnnouncements} =
    useConnection()
  // const [refresh, setRefresh] = useState(false)
  const currentUser: UserModel = useSelector<RootState>(
    (state) => state.auth.user,
    shallowEqual
  ) as UserModel
  socket.auth = currentUser
  const [expirationDate, setExpirationDate] = useState<Date | undefined>(undefined)

  const onEnterPress = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.keyCode === 13 && e.shiftKey === false) {
      e.preventDefault()
      sendMessageToUser()
      // setRefresh((refresh) => !refresh)
    }
  }

  const sendMessageToUser = () => {
    if (currentAnnouncement.length) {
      const data: IAnnouncement = {
        sender: currentUser,
        announcement: currentAnnouncement,
        expiresAt: expirationDate,
        createdAt: new Date(),
      }
      sendAnnouncement(data)
      setCurrentAnnouncement('')
      // receiveAnnouncement()
      // setRefresh((refresh) => !refresh)
    }
  }
  useLayoutEffect(() => {
    getAnnouncements()
    // receiveAnnouncement()
  }, [])

  // if (infoData) {
  //   setRefresh((refresh) => !refresh)
  // }

  function handleRemove(paraAnnouncememnt: IAnnouncement) {
    setInfoData(infoData.filter((announcement: any) => announcement.id !== paraAnnouncememnt?.id))
    deleteAdminAnnouncement(paraAnnouncememnt?.id as string)
    socket.emit('deleteAnnouncement', paraAnnouncememnt)

    const announcementElement = document.getElementById(`announcement-${paraAnnouncememnt?.id}`)
    if (announcementElement) {
      announcementElement.remove()
    }
  }
  const sortedData = infoData.sort((a: IAnnouncement, b: IAnnouncement) => {
    const dateA: any = new Date(a.createdAt as Date)
    const dateB: any = new Date(b.createdAt as Date)
    return dateB - dateA
  })
  return (
    <div>
      <div className={style.formAnnouncementTop}>
        <h2>Ankündigung</h2>
        <form>
          <div className='card-footer1 pt-4'>
            <div className='d-flex justify-content-between'>
              <div className='expireDateWrapper'>
                <label className='expireDateLabel'>Ablaufdatum (Optional)</label>
                <input
                  className='expireDateInput datepickerbg'
                  type='datetime-local'
                  value={expirationDate ? expirationDate.toISOString().slice(0, -8) : ''}
                  onChange={(e) => setExpirationDate(new Date(e.target.value))}
                />
              </div>
            </div>
            <textarea
              style={{
                border: '1px solid #666464',
                borderRadius: '5px',
                resize: 'none',
              }}
              className='form-control form-control-flush mb-3'
              rows={1}
              data-kt-element='input'
              placeholder='Eine Ankündigung machen'
              value={currentAnnouncement}
              onChange={(e) => {
                setCurrentAnnouncement(e.target.value)
              }}
              onKeyDown={onEnterPress}
            />
            <button
              className='btn btn-primary mx-4 mb-7'
              type='button'
              data-kt-element='send'
              onClick={sendMessageToUser}
            >
              Schicken
            </button>
          </div>
        </form>
      </div>

      <div className={style.formAnnouncementBottom}>
        <h2>Ankündigungen list</h2>
        <div className='card-footer1 pt-4 mt-4'>
          <ul className={style.announcementItem}>
            {sortedData?.map((announcement: any, index: any) => (
              <div
                className='d-flex align-items-center bg-light-success rounded p-5 mb-7'
                key={index}
                style={{backgroundColor: '#313144'}}
              >
                <p style={{marginBottom: '0px'}}>{announcement.announcement}</p>
                <div className='ms-auto'>
                  {announcement.expirationDate && (
                    <small className='text-muted'>
                      Expires on {announcement.expirationDate} at {announcement.expirationTime}
                    </small>
                  )}
                </div>
                <button className='btn btn-danger' onClick={() => handleRemove(announcement)}>
                  ×
                </button>
              </div>
            ))}
          </ul>
        </div>
      </div>
    </div>
  )
}

export default Announcement
