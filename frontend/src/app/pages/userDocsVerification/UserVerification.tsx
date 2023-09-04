import React, { useEffect, useState, useRef } from 'react'
import './agentur.css'
import './cameraModalPop.css'
import './daymode.css'
import './responsive.css'
import { Link } from 'react-router-dom'
import { format } from 'date-fns'
import { toast } from 'react-toastify'
import { useDispatch, useSelector } from 'react-redux'
import { KTSVG } from '../../../_metronic/helpers'
import { getUserDocuments, IUserDocuments, uploadUserDocuments } from './redux/action'
import { Box, CircularProgress, Modal, Typography } from '@mui/material'
import Button from '@mui/material/Button'
import { RootState } from '../../../setup'
import { UserModel } from '../../modules/auth/models/UserModel'
import IconApproved from './redux/iconApproved'
import IconPending from './redux/iconPending'
import IconRejected from './redux/iconRejected'

const UserVerification: React.FC = () => {
  const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: window.innerWidth <= 768 ? '275px' : '700px',
    height: '80vh',
    bgcolor: '#1f1e2d',
    color: '#fff',
    // border: '2px solid #000',
    borderRadius: '15px',
    boxShadow: 24,
    // overflow: 'hidden',
    overflowY: 'scroll',
    p: 4,
  }

  const user: any = useSelector<RootState>(({ auth }) => auth.user) as UserModel
  const dispatch = useDispatch()
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [pdfFile, setPdfFile] = useState<File | null>(null)
  const [idFrontCapture, setIdFrontCapture] = useState<string | null>(null)
  const [idBackCapture, setIdBackCapture] = useState<string | null>(null)
  const [selfieCapture, setSelfieCapture] = useState<string | null>(null)
  const [ID_FRONT, setID_FRONT] = useState<string | null>(null)
  const [ID_BACK, setID_BACK] = useState<string | null>(null)
  const [SELFIE, setSELFIE] = useState<string | null>(null)
  const [userDocumentId, setUserDocumentId] = useState<any | null>(null)
  const [cameraActive, setCameraActive] = useState(false)
  const [showCaptureButton, setShowCaptureButton] = useState(false)
  const [currentTab, setCurrentTab] = useState(0)
  const [capturedImageURL, setCapturedImageURL] = useState<string | null>(null)
  const [capturedImagesArray, setCapturedImagesArray] = useState<string[]>([])
  const [openReasonModal, setOpenReasonModal] = useState(false) as any
  const [rejectedPopupReason, setRejectedPopupReason] = useState<string>('')
  const [contractUploaded, setContractUploaded] = useState(false)
  const [idFrontImageUploaded, setIdFrontImageUploaded] = useState(false)
  const [idBackImageUploaded, setIdBackImageUploaded] = useState(false)
  const [selfieImageUploaded, setSelfieImageUploaded] = useState(false)
  const [loading, setLoading] = useState(false) as any
  const [success, setSuccess] = useState(false) as any

  const [formattedDates, setFormattedDates] = useState<{ [key: string]: string }>({})

  const userDocumentss = useSelector<RootState, any>((state) => state.Contracts.userDocuments)

  const videoRef = useRef<any | null>(null)
  const canvasRef = useRef<any | null>(null)

  function formatDate(isoDateString: string | undefined, documentId: string): string {
    if (!isoDateString) {
      return ''
    }

    const date = new Date(isoDateString)
    return format(date, 'MMM d, yyyy HH:mm')
  }

  document.addEventListener('DOMContentLoaded', (_event) => {
    showTab(currentTab)
  })
  const headings = [
    'Upload a Contract Form:',
    'Upload Clear Picture of ID Card Front Side:',
    'Upload Clear Picture of ID Card Back Side:',
    'Upload Your Clear Selfie with ID Card:',
  ]
  const tabs = [
    <div className='tab'>
      <h3>Step 1</h3>
    </div>,
    <div className='tab'>
      <h3>Step 2</h3>
    </div>,
    <div className='tab'>
      <h3>Step 3</h3>
    </div>,
    <div className='tab'>
      <h3>Step 4</h3>
    </div>,
  ]
  const showTab = (index: number) => {
    setCurrentTab(index)
  }
  const nextPrev = (step: number) => {
    setCapturedImageURL(null)
    if (step === -1 && currentTab === 0) {
      return
    }

    if (step === 1 && !validateForm()) {
      return
    }

    if (currentTab === 0) {
      setShowCaptureButton(true)
    }

    setCurrentTab((prevTab) => prevTab + step)
  }

  function validateForm() {
    let x,
      y,
      i,
      valid = true
    x = document.getElementsByClassName('tab') as HTMLCollectionOf<HTMLElement>
    y = x[currentTab].getElementsByTagName('input') as HTMLCollectionOf<HTMLInputElement>
    for (i = 0; i < y.length; i++) {
      if (y[i].value === '') {
        y[i].className += ' invalid'
        valid = false
      }
    }
    if (valid) {
      const steps = document.getElementsByClassName('step') as HTMLCollectionOf<HTMLElement>
      steps[currentTab].className += ' finish'
    }
    return valid
  }

  useEffect(() => {
    if (user.id) {
      setUserDocumentId(user.id)
    }
    dispatch(getUserDocuments(user.id))

    const updatedFormattedDates: { [key: string]: string } = {}
    userDocumentss?.forEach((document: any) => {
      updatedFormattedDates[document.id] = formatDate(document.updatedAt, document.id)
    })
    setFormattedDates(updatedFormattedDates)
  }, [user.id])

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file: any = event.target.files?.[0] || null
    setSelectedFile(file)
    setPdfFile(file)
    setContractUploaded(true)
  }

  const handleCaptureClick = (event?: any) => {
    setLoading(true)
    setCameraActive(true)
    startCamera()
    // setLoading(false)
  }
  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true })
      if (videoRef.current) {
        videoRef.current.srcObject = stream
        videoRef.current.play()
        setLoading(false)
      }
      // handleCaptureDone(null, true, name)
    } catch (error) {
      console.error('Error accessing camera:', error)
      setLoading(false)
    }
  }
  const handleCaptureDone = async (event: any, image?: boolean, name?: string) => {
    if (videoRef.current && canvasRef.current) {
      const stream = videoRef.current.srcObject as MediaStream
      const tracks = stream.getTracks()
      tracks.forEach((track) => track.stop())

      const videoWidth = videoRef.current.videoWidth
      const videoHeight = videoRef.current.videoHeight

      canvasRef.current.width = videoWidth
      canvasRef.current.height = videoHeight

      const ctx = canvasRef.current.getContext('2d')
      if (ctx) {
        ctx.drawImage(videoRef.current, 0, 0, videoWidth, videoHeight)
        canvasRef.current.toBlob(
          (blob: any) => {
            if (blob) {
              // Convert blob to URL and set the state
              const capturedImageBlobURL = URL.createObjectURL(blob)
              setCapturedImageURL(capturedImageBlobURL)

              if (name) {
                handleUpload(null, image, new File([blob], `${name}.jpg`), name)
              } else {
                if (currentTab === 1) {
                  setIdFrontCapture(new File([blob], 'idFrontCapture.jpg') as any)
                  setIdFrontImageUploaded(true)
                } else if (currentTab === 2) {
                  setIdBackCapture(new File([blob], 'idBackCapture.jpg') as any)
                  setIdBackImageUploaded(true)
                } else if (currentTab === 3) {
                  setSelfieCapture(new File([blob], 'selfieCapture.jpg') as any)
                  setSelfieImageUploaded(true)
                }
              }
            }
          },
          'image/jpeg',
          1
        )
      }

      videoRef.current.srcObject = null
      setCameraActive(false)
    }
  }

  const handleNextClick = () => {
    if (capturedImageURL) {
      setCapturedImagesArray((prevArray) => [...prevArray, capturedImageURL])
    }
    setCapturedImageURL(null)

    if (currentTab === tabs.length - 1) {
      alert('Form submitted')
    } else {
      nextPrev(1)
    }
  }

  const handleUpload = async (event?: any, image?: boolean, imageFile?: any, name?: any) => {
    setLoading(true)
    setSuccess(false)

    const payload: IUserDocuments = {
      userId: user.id as string,
      contract: pdfFile ?? event?.target?.files?.[0],
      idBack: idBackCapture ?? (name === 'ID_BACK' ? imageFile : undefined),
      selfie: selfieCapture ?? (name === 'SELFIE' ? imageFile : undefined),
      idFront: idFrontCapture ?? (name === 'ID_FRONT' ? imageFile : undefined),
    }

    try {
      await dispatch(uploadUserDocuments(payload))
      setSuccess(true)
      toast.success('Documents submitted successfully') // Show success toast
    } catch (error) {
      console.error('Error uploading documents:', error)
      toast.error('Error uploading documents')
    } finally {
      setLoading(false)
    }
  }

  const handleFileReUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    handleFileChange(event)
    handleUpload(event)
  }
  const handleImageReUpload = (event: React.ChangeEvent<HTMLInputElement> | any, name?: string) => {
    const image: boolean = true
    handleCaptureClick(null)
  }

  const handleSeeReason = (reason: string) => {
    setOpenReasonModal(true)
    setRejectedPopupReason(reason)
  }

  return (
    <div id='pageMainContainer'>
      <div className='navbar'>
        <Link to='/logout' className='menu-link px-5'>
          <img src='/media/icons/duotune/art/logoutIcon.svg' alt='' />
          Austragen
        </Link>
      </div>
      <div className='bodyMainContainer'>
        <div className='leftSideContainer'>
          <div className='leftContainer_heading'>
            <h2>Document Upload</h2>
          </div>
          <div className='leftContainer_body'>
            <p>
              Lorem ipsum dolor sit amet, consectetur adipisicing elit. Quo quos rerum soluta nobis
              velit deserunt, autem doloribus voluptatum nihil necessitatibus minima laudantium
              cupiditate illo, eaque blanditiis. Minus cumque dolorum inventore. Dolor quisquam ad,
              quas excepturi tenetur nam numquam quibusdam nemo quasi distinctio,
            </p>

            <p>
              Lorem ipsum dolor sit amet consectetur adipisicing elit. Rem cumque quidem quod
              voluptatum accusamus veritatis maiores{' '}
            </p>

            <p>
              Lorem ipsum dolor sit, amet consectetur adipisicing elit. Non ipsam itaque voluptatem
              odio.Non ipsam itaque voluptatem odio.{' '}
            </p>

            <p>
              <b>Lorem ipsum dolor, sit amet consectetur adipisicing elit.</b>
            </p>

            <p>
              <span>
                <b>Hinweis: </b>
              </span>
              Lorem ipsum dolor sit amet consectetur adipisicing elit. Mollitia ratione totam quo
              minus!
            </p>
          </div>

          <div className='leftContainer_fileSubmit'>
            <div className='fileSubmit_heading'>
              <h2>
                {currentTab === 0
                  ? 'Upload a Contract Form:'
                  : currentTab === 1
                    ? 'Upload Clear Picture of ID Card Front Side:'
                    : currentTab === 2
                      ? 'Upload Clear Picture of ID Card Back Side:'
                      : 'Upload Your Clear Selfie with ID Card:'}
              </h2>
            </div>
            <div className='uploadButtons'>
              <div className='upload-btn-wrapper'>
                <button className='btnUpload'>
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
                  <p>Upload a PDF file</p>
                </button>
                <input
                  type='file'
                  name='myfile'
                  id='myfile'
                  accept='.pdf'
                  onChange={handleFileChange}
                />
              </div>
              {currentTab !== 0 && (
                <div
                  className='capture-btn-wrapper'
                  style={{ display: showCaptureButton ? 'block' : 'none' }}
                >
                  <button className='btnUpload' id='capturebtn' onClick={handleCaptureClick}>
                    <svg
                      xmlns='http://www.w3.org/2000/svg'
                      width='40px'
                      height='40px'
                      viewBox='0 0 24 24'
                      version='1.1'
                    >
                      <g stroke='none' stroke-width='1' fill='none' fill-rule='evenodd'>
                        <rect x='0' y='0' width='24' height='24' />
                        <path
                          d='M5,7 L19,7 C20.1045695,7 21,7.8954305 21,9 L21,17 C21,18.1045695 20.1045695,19 19,19 L5,19 C3.8954305,19 3,18.1045695 3,17 L3,9 C3,7.8954305 3.8954305,7 5,7 Z M12,17 C14.209139,17 16,15.209139 16,13 C16,10.790861 14.209139,9 12,9 C9.790861,9 8,10.790861 8,13 C8,15.209139 9.790861,17 12,17 Z'
                          fill='#fff'
                        />
                        <rect fill='#fff' opacity='0.3' x='9' y='4' width='6' height='2' rx='1' />
                        <circle fill='#fff' opacity='0.3' cx='12' cy='13' r='2' />
                      </g>
                    </svg>
                    <p>Capture</p>
                  </button>
                </div>
              )}
            </div>
          </div>
          <>
            {currentTab === 0 && contractUploaded ? (
              <p className='upload-success-message'>Successfully document is uploaded</p>
            ) : currentTab === 1 && idFrontImageUploaded ? (
              <p className='upload-success-message'>Successfully ID Front Picture is uploaded</p>
            ) : currentTab === 2 && idBackImageUploaded ? (
              <p className='upload-success-message'>Successfully ID Back Picture is uploaded</p>
            ) : currentTab === 3 && selfieImageUploaded ? (
              <p className='upload-success-message'>Successfully selfie is uploaded</p>
            ) : (
              ''
            )}
          </>
          {/* <div className='fileSubmissionCotainer'>
            <p className='fileSubmission_Text' id='fileName'></p>
          </div> */}
          <div>
            {cameraActive ? (
              <div>
                <video ref={videoRef} autoPlay playsInline />
                {loading ? (
                  <CircularProgress color='inherit' size={24} />
                ) : (
                  <>
                    <button
                      onClick={() => {
                        setLoading(true)
                        handleCaptureDone(null, true, ID_FRONT as any)
                        setLoading(false)
                      }}
                    >
                      Capture
                    </button>
                  </>
                )}
              </div>
            ) : (
              <div className='capture-btn-wrapper'>
                <button className='btn' id='capturebtn' onClick={handleCaptureClick}></button>
              </div>
            )}

            {capturedImageURL && (
              <div>
                <img src={capturedImageURL} alt='Captured' />
              </div>
            )}
            <canvas ref={canvasRef} style={{ display: 'none' }} />
          </div>

          {/* ------------------------------------------------------- */}
          <div className='container mt-5'>
            <div className='row d-flex justify-content-center align-items-center'>
              <div className='col-md-6'>
                <form id='regForm'>
                  <div className='all-steps' id='all-steps'>
                    {headings.map((heading, index) => (
                      <span
                        className={`step ${currentTab === index ? 'active' : ''}`}
                        key={index}
                      />
                    ))}
                  </div>
                  {tabs.map((tab, index) => (
                    <div key={index} style={{ display: currentTab === index ? 'block' : 'none' }}>
                      {tab}
                    </div>
                  ))}
                  <div style={{ overflow: 'auto' }} id='nextprevious'>
                    <div className='button-container' style={{ float: 'right' }}>
                      {currentTab !== 0 && currentTab !== tabs.length - 1 && (
                        <button
                          className='btn btn-secondary'
                          type='button'
                          id='prevBtn'
                          onClick={() => nextPrev(-1)}
                        >
                          Previous
                        </button>
                      )}

                      <button
                        className={`btn btn-primary mx-4 ${loading ? 'spinner spinner-white spinner-right' : ''
                          }`}
                        type='button'
                        id='nextBtn'
                        onClick={() => {
                          if (currentTab === tabs.length - 1) {
                            if (pdfFile || idBackCapture || selfieCapture || idFrontCapture) {
                              setCapturedImageURL(null)
                              handleUpload()
                            } else {
                              toast.warn('Please upload at least one document')
                            }
                          } else {
                            handleNextClick()
                          }
                        }}
                      >
                        {loading
                          ? 'Uploading...'
                          : currentTab === tabs.length - 1
                            ? 'Submit'
                            : 'Next'}
                      </button>
                    </div>
                  </div>
                </form>
              </div>
            </div>
          </div>
          {/* ------------------------------------------------------- */}
        </div>
        <div className='rightSideContainer'>
          <h2>Deine Document</h2>
          <table>
            <thead>
              <tr className='tableHeader'>
                <td>File Name</td>
                <td>Upload</td>
                <td>Status</td>
                <td>Download</td>
                <td>Upload Time</td>
              </tr>
            </thead>
            <tbody>
              {userDocumentss?.map((document: any) => (
                <tr className='tableBody' key={document.id}>
                  <td>
                    <p>{document.name}</p>
                  </td>
                  <td>
                    {document.name === 'CONTRACT' && (
                      <div
                        className='retake-documents upload-btn-wrapper'
                        style={{ cursor: 'pointer' }}
                      >
                        <KTSVG
                          path='/media/icons/duotune/files/fil022.svg'
                          className='svg-icon-muted svg-icon-2hx'
                        />
                        <input
                          type='file'
                          name='myfile'
                          id='myfilee'
                          accept='.pdf'
                          onChange={handleFileReUpload}
                        />
                      </div>
                    )}
                    {document.name === 'SELFIE' && (
                      <div
                        className='retake-documents'
                        onClick={() => {
                          setID_FRONT(document.name)
                          handleImageReUpload(null, document?.name)
                        }}
                      >
                        <KTSVG
                          path='/media/icons/duotune/files/fil022.svg'
                          className='svg-icon-muted svg-icon-2hx'
                        />
                      </div>
                    )}
                    {document.name === 'ID_FRONT' && (
                      <div
                        className='retake-documents'
                        onClick={() => {
                          setID_FRONT(document.name)
                          handleImageReUpload(null, document?.name)
                        }}
                      >
                        <KTSVG
                          path='/media/icons/duotune/files/fil022.svg'
                          className='svg-icon-muted svg-icon-2hx'
                        />
                      </div>
                    )}
                    {document.name === 'ID_BACK' && (
                      <div
                        className='retake-documents'
                        onClick={() => {
                          setID_FRONT(document.name)
                          handleImageReUpload(null, document?.name)
                        }}
                      >
                        <KTSVG
                          path='/media/icons/duotune/files/fil022.svg'
                          className='svg-icon-muted svg-icon-2hx'
                        />
                      </div>
                    )}
                  </td>

                  <td className='approved_Icon_text'>
                    {document.status === 'APPROVED' && <IconApproved />}
                    {document.status === 'REJECTED' && <IconRejected />}
                    {document.status === 'PENDING' && <IconPending />}
                    {document.status === 'APPROVED' && (
                      <p style={{ color: '#33d12a' }}>{document.status}</p>
                    )}
                    {document.status === 'REJECTED' && (
                      <p style={{ color: 'red' }}>{document.status}</p>
                    )}
                    {document.status === 'PENDING' && (
                      <p style={{ color: '#faaa00' }}>{document.status}</p>
                    )}

                    {document.reason ? (
                      <p
                        onClick={() => handleSeeReason(document?.reason)}
                        style={{ color: 'yellow', cursor: 'pointer', textDecoration: 'underline' }}
                      >
                        See reason
                      </p>
                    ) : (
                      ''
                    )}
                  </td>

                  <td>
                    {document.link && (
                      <a href={document?.link} download target='_blank' rel='noreferrer'>
                        <KTSVG
                          path='/media/icons/duotune/files/fil021.svg'
                          className='svg-icon-muted svg-icon-2hx'
                        />
                      </a>
                    )}
                  </td>
                  <td>
                    <p>
                      <p>{formattedDates[document.id]}</p>
                    </p>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
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
              // border: '1px solid gray',
              borderRadius: '50%',
              height: '24px',
              width: '24px',
              padding: '0',
              float: 'right',
              minWidth: 'auto',
              position: 'absolute',
              background: '#transparent',
              right: '10px',
              top: '10px',
              '&:hover': {
                padding: '0',
                borderRadius: '10px',
                // background: 'transparent',
              },
            }}
          >
            <KTSVG
              path='/media/icons/duotune/general/gen034.svg'
              className='svg-icon-muted svg-icon-2hx'
            />
          </Button>
          <h2
            style={{
              marginTop: '20px',
              textAlign: 'center',
              color: '#fff',
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
    </div>
  )
}
export default UserVerification
