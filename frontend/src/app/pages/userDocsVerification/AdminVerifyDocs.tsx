import React, {useEffect, useState} from 'react'
import './agentur.css'
import './cameraModalPop.css'
import {format} from 'date-fns'
import './daymode.css'
import './responsive.css'
import {KTSVG} from '../../../_metronic/helpers'
import {Link, useParams, useLocation} from 'react-router-dom'
import {UserModel} from '../../modules/auth/models/UserModel'
import {RootState} from '../../../setup'
import {useDispatch, useSelector} from 'react-redux'
import {UsersList} from '../../../_metronic/partials/widgets/tables/redux/usersAction'
import {Box, CircularProgress, Modal, Typography} from '@mui/material'
import Button from '@mui/material/Button'
import {
  DocumentStatusEnum,
  getUserDocuments,
  handleLoadingState,
  IContract,
  IUpdateStatus,
  UpdateUserDocsStatus,
  uploadUserContract,
} from './redux/action'
import {toast} from 'react-toastify'
export default function AdminVerifyDocs() {
  const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: window.innerWidth <= 768 ? '275px' : '700px',
    height: '80vh',
    bgcolor: 'background.paper',
    // border: '2px solid #000',
    borderRadius: '15px',
    boxShadow: 24,
    // overflow: 'hidden',
    overflowY: 'scroll',
    p: 4,
  }
  const loaderStyle = {
    position: 'absolute',
    width: '10px',
    height: '10px',
    bgcolor: 'background.paper',
  }
  const location = useLocation()
  const cleanParamValue: any = location.search ? location.search.replace(/^\?/, '') : null
  const [isModalOpen, setIsModalOpen] = useState(false) as any
  const [openReasonModal, setOpenReasonModal] = useState(false) as any
  const isMobileView = window.innerWidth <= 768
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [contracName, setContracName] = useState<string>('')
  const [isLoading, setLoading] = useState<any>(false)
  const [contractUserId, setcontractUserId] = useState<string>('')
  const [userNewStatus, setUserNewStatus] = useState<string>('')
  const [rejectedDocumentId, setRejectedDocumentId] = useState<string>('')
  const [rejectionReason, setRejectionReason] = useState<string>('')
  const [rejectedPopupReason, setRejectedPopupReason] = useState<string>('')

  const dispatch = useDispatch()
  const [selectedUserIds, setSelectedUserIds] = useState<string[]>([])
  const [rejectionErrorMessage, setRejectionErrorMessage] = useState<string>('')
  const [updatedDateAndTime, setUpdatedDateAndTime] = useState<string>('')
  // const rejectionErrorMessage="Reason should not be empty"
  const [selectedUserNames, setSelectedUserNames] = useState<string[]>([])
  const userList = useSelector<RootState>(({user}) => user.users) as UserModel[]
  // const userContractdata = useSelector<RootState>(({Contracts}) => Contracts?.userDocuments)
  const userContractdata = useSelector<RootState, any>(({Contracts}) => Contracts?.userDocuments)
  const {uploadedContract} = useSelector<RootState, any>(({Contracts}) => Contracts)
  const handleUserSelection = (event: any) => {
    dispatch(getUserDocuments(event.target.value))
    const selectedUserId = event.target.value
    const selectedUserName = event.target.options[event.target.selectedIndex].text
    //  const userStatusUpdated = useSelector<RootState>(({user}) => user.userStatusUpdated) as any
    setContracName('CONTRACT')
    setcontractUserId(event.target.value)
    if (!selectedUserIds?.includes(selectedUserId)) {
      // dispatch(getUserDocuments(contractUserId))
      setSelectedUserIds(selectedUserId === 'Select User' ? null : selectedUserId)
      setSelectedUserNames(selectedUserName === 'Select User' ? null : selectedUserName)
    }
  }

  console.log(userContractdata, 'userContractdataaa')
  const handleUserStatusUpdate = (event: any) => {
    const currentDateTime = new Date()
    setUpdatedDateAndTime(formatDate(currentDateTime.toISOString()))
    const documentId = event.target.getAttribute('data-id')

    const userStatus = event.target.value
    setUserNewStatus(event.target.value)
    setRejectedDocumentId(event.target.getAttribute('data-id'))
    const payload: IUpdateStatus = {
      userId: contractUserId ? contractUserId : cleanParamValue,
      status: userStatus as DocumentStatusEnum,
      documentId: documentId as string,
      reason: rejectionReason ? rejectionReason : ('' as string),
    }
    if (event.target.value === 'REJECTED') {
      setIsModalOpen(true)
    }

    if (event.target.value !== 'REJECTED') {
      dispatch(UpdateUserDocsStatus(payload))
    }
  }
  // const handleStatusUpdate = async () => {
  //   try {
  //     dispatch(UpdateUserStatus(userId, 'ACTIVE'))
  //   } catch (error) {}
  // }

  useEffect(() => {
    dispatch(UsersList())
  }, [])

  // const redirectedSelectedUserId = localStorage.getItem('selectedUserId')
  // const paramSelectedUser: any = localStorage.getItem('selectedUser')
  // const paramSelectedUser2 = JSON.parse(paramSelectedUser)
  // console.log('paramSelectedUser2', paramSelectedUser2.userName)
  // const redirectedUser = redirectedSelectedUserId
  //   ? redirectedSelectedUserId.replace(/['"]/g, '')
  //   : null

  useEffect(() => {
    dispatch(getUserDocuments(cleanParamValue))
  }, [cleanParamValue])

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0] || null
    setSelectedFile(file)
  }
  const handleUpload = () => {
    if (selectedFile && contractUserId) {
      const payload: IContract = {
        userId: contractUserId,
        name: contracName,
        file: selectedFile,
      }

      dispatch(uploadUserContract(payload))
      setLoading(true)
      // const currentDateTime = new Date()
      // setUpdatedDateAndTime(formatDate(currentDateTime.toISOString()))
    } else if (!contractUserId) {
      toast.error('Please select a user!')
    } else if (!selectedFile) {
      toast.error('Please add a file to upload!')
    }
  }
  if (uploadedContract?.length) {
    setLoading(false)
    dispatch(handleLoadingState())
    dispatch(getUserDocuments(contractUserId))
  }
  console.log('isLoading', isLoading)
  function formatDate(isoDateString: string | undefined): string {
    if (!isoDateString) {
      return ''
    }

    const date = new Date(isoDateString)
    return format(date, 'MMM d, yyyy HH:mm')
  }
  const handleRejection = () => {
    const currentDateTime = new Date()
    setUpdatedDateAndTime(formatDate(currentDateTime.toISOString()))
    const payload: IUpdateStatus = {
      userId: contractUserId ? contractUserId : cleanParamValue,
      status: userNewStatus as DocumentStatusEnum,
      documentId: rejectedDocumentId as string,
      reason: rejectionReason as string,
    }
    if (rejectionReason.trim() === '') {
      setRejectionErrorMessage('Please write a reason')
    } else {
      dispatch(UpdateUserDocsStatus(payload))
      setIsModalOpen(false)
      setRejectionReason('')
    }
  }

  const handleSeeReason = (reason: string) => {
    setOpenReasonModal(true)
    setRejectedPopupReason(reason)
  }
  const matchedUser: any = userList?.find((user: any) => user?.id === cleanParamValue)
  return (
    <div id='pageMainContainer'>
      <div className='bodyMainContainerAdmin'>
        <div className='leftSideContainer'>
          <div className='leftContainer_heading'>
            <h2>ADMIN DOCUMENT SECTION</h2>
          </div>

          <div className={'form_SelectOptionWrap'}>
            <select
              id='user_selection'
              className={'form_group_select'}
              onChange={handleUserSelection}
            >
              {cleanParamValue ? (
                <option> {matchedUser?.userName} </option>
              ) : (
                <option>Select User</option>
              )}

              {userList && userList.length ? (
                userList.map((user, idx) => (
                  <option key={idx} value={user.id}>
                    {' '}
                    {user.userName}
                  </option>
                ))
              ) : (
                <option disabled>No User Found!</option>
              )}
            </select>
          </div>

          <div className='leftContainer_fileSubmitAdmin'>
            <div className='fileSubmit_headingAdmin'>
              <h2>Upload Contract:</h2>
            </div>
            <div className='uploadButtonsAdmin'>
              <div className='upload-btn-wrapperAdmin'>
                <button className='btn'>
                  <svg
                    xmlns='http://www.w3.org/2000/svg'
                    viewBox='0 0 24 24'
                    fill='none'
                    height='40px'
                    width='40px'
                    stroke='currentColor'
                    stroke-width='2'
                    stroke-linecap='round'
                    stroke-linejoin='round'
                    className='feather feather-plus'
                  >
                    <line x1='12' y1='5' x2='12' y2='19' id='id_101'></line>
                    <line x1='5' y1='12' x2='19' y2='12' id='id_102'></line>
                  </svg>
                </button>
                <input
                  type='file'
                  name='myfile'
                  id='myfile'
                  accept='.pdf'
                  onChange={handleFileChange}
                />
              </div>
            </div>
          </div>
          {selectedFile?.name ? (
            <div className='selectedFileDiv'>
              <div className='selectedFileDivInner'>{selectedFile?.name}</div>
            </div>
          ) : (
            ''
          )}

          <div className='fileSubmissionCotainer'>
            <p className='fileSubmission_Text' id='fileName'></p>
            <button
              onClick={() => {
                handleUpload()
              }}
            >
              Submit
              {isLoading ? (
                <CircularProgress
                  style={{height: '15px', width: '15px', marginLeft: '15px', display: 'flex'}}
                />
              ) : (
                ''
              )}
            </button>
          </div>
        </div>

        <div className='rightSideContainer'>
          <div className='selectedUserDetails'>
            <h3>{contractUserId ? selectedUserNames : matchedUser?.userName}</h3>
            {/* // {cleanParamValue && <h3>{matchedUser?.userName}</h3>} */}
          </div>
          {!isMobileView ? (
            <table>
              <thead>
                <tr className='tableHeader'>
                  <td>File Name</td>
                  <td>Status</td>
                  <td>Download</td>
                  <td>Upload Time</td>
                </tr>
              </thead>
              {(contractUserId && selectedUserNames) || (cleanParamValue && selectedUserNames) ? (
                <tbody>
                  {userContractdata?.map((contractData: any, index: number) => (
                    <tr className='tableBody' key={index}>
                      <td>
                        <p>{contractData?.name}</p>
                      </td>
                      <td>
                        <select
                          id='user_selection'
                          className={'form_group_select_status'}
                          onChange={handleUserStatusUpdate}
                          data-id={contractData?.id}
                          value={userNewStatus ? userNewStatus : contractData?.status}
                        >
                          <option>PENDING</option>
                          <option>APPROVED</option>
                          <option>REJECTED</option>
                        </select>
                        {userNewStatus === 'REJECTED' || contractData?.status === 'REJECTED' ? (
                          <button onClick={() => handleSeeReason(contractData?.reason)}>
                            See reason
                          </button>
                        ) : (
                          ''
                        )}
                      </td>
                      <td>
                        <a href={contractData?.link} target='_blank' rel='noopener noreferrer'>
                          <KTSVG
                            path='/media/icons/duotune/files/fil022.svg'
                            className='svg-icon-muted svg-icon-2hx'
                          />
                        </a>
                      </td>
                      <td>
                        <p>
                          {updatedDateAndTime
                            ? updatedDateAndTime
                            : formatDate(contractData?.updatedAt)}
                        </p>
                      </td>
                    </tr>
                  ))}
                </tbody>
              ) : (
                <p>Please Select Any User</p>
              )}
            </table>
          ) : (
            <table className='mobileViewTable'>
              <tbody>
                {contractUserId && selectedUserNames ? (
                  <>
                    {userContractdata?.map((contractData: any, index: number) => (
                      <>
                        <tr key={index}>
                          <td>File Name</td>
                          <td>{contractData?.name}</td>
                        </tr>
                        <tr key={`status-${index}`}>
                          <td>Status</td>
                          <td>
                            <select
                              id='user_selection'
                              className={'form_group_select_status'}
                              onChange={handleUserStatusUpdate}
                              data-id={contractData?.id}
                              value={userNewStatus ? userNewStatus : contractData?.status}
                            >
                              <option>PENDING</option>
                              <option>APPROVED</option>
                              <option>REJECTED</option>
                            </select>
                            {userNewStatus === 'REJECTED' || contractData?.status === 'REJECTED' ? (
                              <button onClick={() => handleSeeReason(contractData?.reason)}>
                                See reason
                              </button>
                            ) : (
                              ''
                            )}
                          </td>
                        </tr>
                        <tr key={`download-${index}`}>
                          <td>Download</td>
                          <td>
                            <a href={contractData?.link} target='_blank' rel='noopener noreferrer'>
                              <KTSVG
                                path='/media/icons/duotune/files/fil022.svg'
                                className='svg-icon-muted svg-icon-2hx'
                              />
                            </a>
                          </td>
                        </tr>
                        <tr key={`time-${index}`}>
                          <td>Upload Time</td>
                          <td>
                            {updatedDateAndTime
                              ? updatedDateAndTime
                              : formatDate(contractData?.createdAt)}
                          </td>
                        </tr>
                      </>
                    ))}
                  </>
                ) : (
                  <tr>
                    <td colSpan={2}>Please Select Any User</td>
                  </tr>
                )}
              </tbody>
            </table>
          )}
          {/* <table>
            <thead>
              <tr className='tableHeader'>
                <td>File Name</td>
                <td>Status</td>
                <td>Download</td>
                <td>Upload Time</td>
              </tr>
            </thead>
            {contractUserId && selectedUserNames ? (
              <tbody>
                {userContractdata?.map((contractData: any, index: number) => (
                  <tr className='tableBody' key={index}>
                    <td>
                      <p>{contractData?.name}</p>
                    </td>
                    <td>
                      <select
                        id='user_selection'
                        className={'form_group_select_status'}
                        onChange={handleUserStatusUpdate}
                        data-id={contractData?.id}
                        value={userNewStatus ? userNewStatus : contractData?.status}
                      >
                        <option>PENDING</option>
                        <option>APPROVED</option>
                        <option>REJECTED</option>
                      </select>
                      {contractData?.reason ? (
                        <button onClick={() => handleSeeReason(contractData?.reason)}>
                          See reason
                        </button>
                      ) : (
                        ''
                      )}
                    </td>
                    <td>
                      <a href={contractData?.link} target='_blank' rel='noopener noreferrer'>
                        <KTSVG
                          path='/media/icons/duotune/files/fil022.svg'
                          className='svg-icon-muted svg-icon-2hx'
                        />
                      </a>
                    </td>
                    <td>
                      <p>{formatDate(contractData?.createdAt)}</p>
                    </td>
                  </tr>
                ))}
              </tbody>
            ) : (
              <p>Please Select Any User</p>
            )}
          </table> */}
          {/* *******REJECT TEXT BOX MODAL******* */}
          <Modal
            open={isModalOpen}
            aria-labelledby='parent-modal-title'
            aria-describedby='parent-modal-description'
          >
            <Box
              sx={{
                ...style,
                width: window.innerWidth <= 768 ? '250px' : '350px',
                overflowY: 'hidden',
                height: '260px',
                borderRadius: '10px',
                textAlign: 'center',
                zIndex: '9999',
              }}
            >
              <Button
                onClick={() => {
                  setIsModalOpen(false)
                }}
                sx={{
                  border: '1px solid #000',
                  borderRadius: '50%',
                  height: '24px',
                  width: '24px',
                  padding: '0',
                  float: 'right',
                  minWidth: 'auto',
                  position: 'absolute',
                  background: '#fff',
                  right: '10px',
                  top: '10px',
                  '&:hover': {
                    padding: '0',
                    borderRadius: '5px',
                    background: '#fff',
                  },
                }}
              >
                <KTSVG path='/media/icons/duotune/art/CloseIcon.svg' className='svg-icon-4' />
              </Button>
              <h2
                style={{
                  textAlign: 'center',
                  color: 'rgba(0,0,0,.7)',
                  fontSize: '20px',
                  lineHeight: '20px',
                  margin: '0px 0px 10px;',
                }}
                id='parent-modal-title'
              >
                Reason of rejection
              </h2>
              <textarea
                className='textAreaWrap'
                onChange={(e) => setRejectionReason(e.target.value)}
              ></textarea>
              <button className='rejectButton' onClick={handleRejection}>
                Submit
              </button>
              {rejectionReason.trim() === '' && (
                <p className='errorText'>{rejectionErrorMessage}</p>
              )}
            </Box>
          </Modal>
          {/* *******REJECT TEXT BOX MODAL END******* */}
          {/* *******START REJECT REASON MODAL******* */}
          <Modal
            open={openReasonModal}
            aria-labelledby='parent-modal-title'
            aria-describedby='parent-modal-description'
          >
            <Box
              sx={{
                ...style,
                width: window.innerWidth <= 768 ? '250px' : '350px',
                overflowY: 'hidden',
                height: '260px',
                borderRadius: '10px',
                textAlign: 'center',
                zIndex: '9999',
              }}
            >
              <Button
                onClick={() => {
                  setOpenReasonModal(false)
                }}
                sx={{
                  border: '1px solid #000',
                  borderRadius: '50%',
                  height: '24px',
                  width: '24px',
                  padding: '0',
                  float: 'right',
                  minWidth: 'auto',
                  position: 'absolute',
                  background: '#fff',
                  right: '10px',
                  top: '10px',
                  '&:hover': {
                    padding: '0',
                    borderRadius: '5px',
                    background: '#fff',
                  },
                }}
              >
                <KTSVG path='/media/icons/duotune/art/CloseIcon.svg' className='svg-icon-4' />
              </Button>
              <h2
                style={{
                  marginTop: '20px',
                  textAlign: 'center',
                  color: 'rgba(0,0,0,.7)',
                  fontSize: '20px',
                  lineHeight: '20px',
                  margin: '0px 0px 10px;',
                }}
                id='parent-modal-title'
              >
                Reason of rejection
              </h2>
              <div className='rejectionReasonWrap'>{rejectedPopupReason}</div>
            </Box>
          </Modal>
          {/* *******REJECT REASON MODAL END******* */}
        </div>
      </div>
    </div>
  )
}
