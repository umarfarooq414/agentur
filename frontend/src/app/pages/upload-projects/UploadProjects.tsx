import * as Yup from 'yup'
import {ChangeEvent, FC, useEffect, useRef, useState} from 'react'
import {useFormik} from 'formik'
import {useIntl} from 'react-intl'
import {PageTitle} from '../../../_metronic/layout/core'
import styles from './styles.module.css'
import {useDispatch, useSelector} from 'react-redux'
import {KTSVG} from '../../../_metronic/helpers'
import {
  updateSpecificProject,
  createProject,
  getSpecificProject,
  removeSpecificProject,
  handleMutateProjectFlag,
} from '../projects/redux/action'
import {useHistory, useParams} from 'react-router-dom'
import {RootState} from '../../../setup'
import {
  IProjectInformation,
  projectInformation,
} from '../../modules/accounts/components/settings/SettingsModel'
import {toast} from 'react-toastify'
import {UserModel} from '../../modules/auth/models/UserModel'
import {UsersList} from '../../../_metronic/partials/widgets/tables/redux/usersAction'

const projectFormValidationSchema = Yup.object().shape({
  projectName: Yup.string().required('Project Name is required'),
  projectInfo: Yup.string().required('Proejct Info is required'),
  image: Yup.string().required('Proejct upload is required'),
  projectCompensation: Yup.string().required('Project Compensation is required'),
})

const UploadProjects: FC = () => {
  const [loading, setLoading] = useState(false)
  const [selectedUserIds, setSelectedUserIds] = useState<string[]>([])
  const [selectedUserNames, setSelectedUserNames] = useState<string[]>([])
  const userList = useSelector<RootState>(({user}) => user.users) as UserModel[]
  const [projectData, setProjectData] = useState<IProjectInformation>(projectInformation)
  const {specificProject} = useSelector((state: RootState) => state.Projects)
  const [file, setFile] = useState<File>()
  const inputRef = useRef<HTMLInputElement | null>(null)
  let extension = ''
  let name = ''
  let initials = ''
  let displayName = ''
  const history = useHistory()
  const dispatch = useDispatch()
  const {id} = useParams<{id: string}>()
  useEffect(() => {
    if (specificProject) {
      setProjectData({
        projectName: specificProject.projectName,
        projectInfo: specificProject.projectInfo,
        image:
          // file,
          specificProject.image,
        projectCompensation: specificProject.projectCompensation,
        projectTeam: selectedUserIds,
      })
    }

    return () => {
      dispatch(removeSpecificProject())
    }
  }, [specificProject])

  useEffect(() => {
    if (id?.length) dispatch(getSpecificProject(id))
    dispatch(UsersList())
  }, [])

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) {
      return
    }

    setFile(e.target.files[0])
    inputRef.current?.click()
  }

  const selectImage = () => {
    const images = file ? file : projectData.image
    return images
  }

  // const formikData = useFormik<IProjectInformation>({
  //   initialValues: {
  //     ...projectData,
  //   },
  //   enableReinitialize: true,
  //   onSubmit: (project) => {
  //     if (id?.length) {
  //       dispatch(
  //         updateSpecificProject(
  //           {
  //             ...project,
  //             id: id,
  //             image: selectImage(),
  //           },
  //           history
  //         )
  //       )
  //     }
  //   },
  //   // validationSchema: projectFormValidationSchema,
  // })

  const formikData = useFormik<IProjectInformation>({
    initialValues: {
      ...projectData,
    },
    enableReinitialize: true,

    onSubmit: async (project, {setSubmitting}) => {
      try {
        // debugger
        setLoading(true)
        if (id?.length) {
          dispatch(
            updateSpecificProject(
              {
                ...project,
                id: id,
                image: selectImage(),
              },
              history
            )
          )
          await dispatch(removeSpecificProject()).type
          // setTimeout(() => setSubmitting(false), 3000)
          setLoading(false)
        } else {
          dispatch(createProject({...project, image: file, projectTeam: selectedUserIds}, history))
        }
      } catch (error) {
        setSubmitting(false)
      }
    },
  })
  if (projectData.image) {
    extension = projectData.image.slice(projectData.image.lastIndexOf('.'))
    name = projectData.image.slice(0, projectData.image.lastIndexOf('.'))
    initials = name
      .split(' ')
      .map((word: any) => word[0])
      .join('')
    displayName = `${initials}...${extension}`
  }

  const handleUserSelection = (event: any) => {
    const selectedUserId = event.target.value
    const selectedUserName = event.target.options[event.target.selectedIndex].text

    if (!selectedUserIds.includes(selectedUserId)) {
      setSelectedUserIds([...selectedUserIds, selectedUserId])
      setSelectedUserNames([...selectedUserNames, selectedUserName])
    }
  }

  // const handleRemoveUser = (userToRemove:any) => {
  //   setSelectedUsers(selectedUsers.filter(user => user !== userToRemove));
  // };
  const handleRemoveUser = (userIdToRemove: any) => {
    setSelectedUserIds(selectedUserIds.filter((userId: any) => userId !== userIdToRemove))
    setSelectedUserNames(
      selectedUserNames.filter((_, idx) => selectedUserIds[idx] !== userIdToRemove)
    )
  }
  return (
    <>
      <div className='col-xl-12' id={styles.uploadProjects1}>
        <form
          onSubmit={formikData.handleSubmit}
          className={styles.form_project}
          id='kt_project_upload'
          noValidate
        >
          <div className={styles.form_group}>
            <label htmlFor='project_name' className={styles.form_group_label}>
              Projektname
            </label>
            <input
              type='text'
              id='project_name'
              className={styles.form_group_input}
              {...formikData.getFieldProps('projectName')}
            />
          </div>
          <div className={styles.form_group}>
            <label htmlFor='project_info' className={styles.form_group_label}>
              Projektinfo
            </label>
            <input
              type='text'
              id='project_info'
              className={styles.form_group_input}
              {...formikData.getFieldProps('projectInfo')}
            />
          </div>
          {/* ************** */}
          <label htmlFor='user_selection' className={styles.form_group_label}>
            Select Users
          </label>
          <div className={styles.form_SelectOptionWrap}>
            <select
              id='user_selection'
              className={styles.form_group_select}
              onChange={handleUserSelection}
            >
              <option>Select User</option>
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
            <div className={styles.form_group_selectedUsersList}>
              {selectedUserNames.length > 0 && (
                <div>
                  <ul>
                    {selectedUserNames.map((user, idx) => (
                      <li key={idx}>
                        {user}

                        <span
                          onClick={() => handleRemoveUser(selectedUserIds[idx])}
                          className={styles.closeBtnMain}
                        >
                          <img
                            src='/media/icons/duotune/common/close.svg'
                            alt='Close Icon'
                            className={styles.closeBtn}
                          />
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>
          {/* ************** */}

          <div className={styles.share}>
            <div className={styles.shareWrapper}>
              <div className={styles.shareTop}>
                <img className={styles.shareProfileImg} src='/media/logos/img_logo.png' alt='' />
                <textarea
                  placeholder='Was hast du im Sinn?'
                  className={styles.shareInput}
                  {...formikData.getFieldProps('projectCompensation')}
                  style={{resize: 'none'}}
                />
              </div>
              <hr className={styles.shareHr} />
              <div className={styles.shareBottom}>
                <div className={styles.shareOptions}>
                  <div className={styles.shareOption}>
                    <input
                      type='file'
                      accept='files/*'
                      id='file_to_upload'
                      ref={inputRef}
                      src={projectData?.image ? projectData?.image : ''}
                      onChange={handleFileChange}
                    />
                    {/* {projectData.image ? (
                    <img src={projectData.image} alt='as' className={styles.file_to_upload_img} />
                  ) : (
                    <svg
                      className={styles.photo_svg}
                      focusable='false'
                      color='tomato'
                      aria-hidden='true'
                      viewBox='0 0 24 24'
                      data-testid='PermMediaIcon'
                    >
                      <path d='M2 6H0v5h.01L0 20c0 1.1.9 2 2 2h18v-2H2V6zm20-2h-8l-2-2H6c-1.1 0-1.99.9-1.99 2L4 16c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zM7 15l4.5-6 3.5 4.51 2.5-3.01L21 15H7z'></path>
                    </svg>
                  )} */}

                    {projectData.image ? (
                      extension && extension.includes('.pdf') ? (
                        <a href={projectData.image}>{displayName}</a>
                      ) : (
                        <object data={projectData.image} className={styles.file_to_upload_img}>
                          <param name='wmode' value='transparent' />
                          <img
                            src={projectData.image}
                            alt='as'
                            className={styles.file_to_upload_img}
                          />
                        </object>
                      )
                    ) : (
                      <svg
                        className={styles.photo_svg}
                        focusable='false'
                        color='tomato'
                        aria-hidden='true'
                        viewBox='0 0 24 24'
                        data-testid='PermMediaIcon'
                      >
                        <path d='M2 6H0v5h.01L0 20c0 1.1.9 2 2 2h18v-2H2V6zm20-2h-8l-2-2H6c-1.1 0-1.99.9-1.99 2L4 16c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zM7 15l4.5-6 3.5 4.51 2.5-3.01L21 15H7z'></path>
                      </svg>
                    )}

                    <span className={styles.shareOptionText}>Foto</span>
                  </div>
                </div>
                <button id='kt_password_submit' type='submit' className='btn btn-primary me-2 px-6'>
                  {/* <div style={{display: 'flex', alignItems: 'center'}}> */}
                  {/* Einreichen */}
                  {loading ? (
                    <span className='indicator-progress' style={{display: 'block'}}>
                      Please wait...
                      <span className='spinner-border spinner-border-sm align-middle ms-2'></span>
                    </span>
                  ) : (
                    <span className='indicator-label'>Einreichen</span>
                  )}
                  {/* </div> */}
                </button>
              </div>
            </div>
          </div>
        </form>
      </div>
    </>
  )
}

export const UploadProjectsWrapper: FC = () => {
  const intl = useIntl()
  return (
    <>
      <PageTitle breadcrumbs={[]}>{intl.formatMessage({id: 'Projekte hochladen'})}</PageTitle>
      <UploadProjects />
    </>
  )
}
