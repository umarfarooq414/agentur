import moment from 'moment'
import {useEffect} from 'react'
import {useDispatch, useSelector} from 'react-redux'
import {Link, useHistory} from 'react-router-dom'
import {toast} from 'react-toastify'
import {RootState} from '../../../setup'
import {KTSVG} from '../../../_metronic/helpers'
import {PageTitle} from '../../../_metronic/layout/core'
import {UserModel} from '../../modules/auth/models/UserModel'
import {
  getAllProjects,
  deleteProject,
  getSpecificProject,
  handleMutateProjectFlag,
} from './redux/action'
import style from './style.module.css'
export const ProjectsWrapper = () => {
  const history = useHistory()
  const {allProjects, projectMutated} = useSelector((state: RootState) => state?.Projects)
  console.log('allProject', allProjects)
  const user = useSelector<RootState>(({auth}) => auth.user) as UserModel
  const dispatch = useDispatch()
  useEffect(() => {
    dispatch(getAllProjects())
  }, [])
  console.log(user, "userrrr")

  useEffect(() => {
    if (projectMutated?.length) {
      toast.success(projectMutated)
      dispatch(handleMutateProjectFlag())
    } else if (projectMutated === false) {
      toast.error('Something went wrong')
      dispatch(handleMutateProjectFlag())
    }
  }, [])
  const handleSelectChange = (event: any) => {
    const selectedUserId = event.target.value
    if (selectedUserId) {
      history.push(`/user/${selectedUserId}`)
    }
  }
  return (
    <>
      <PageTitle>{user.role === 'MEMBER' ? 'Dashboard' : 'Projekte'}</PageTitle>
      {/* {user.role === 'ADMIN' && <PageTitle> Projekte </PageTitle>} */}
      <div className='col-xl-12'>
        <div className='card-body py-3'>
          <div className='table-responsive'>
            <table className='table table-row-dashed table-row-gray-300 align-middle gs-0 gy-4'>
              <thead>
                <tr className='fw-bolder text-muted'>
                  <th className='min-w-150px'>Projekt</th>
                  <th className='min-w-150px'>Project Team</th>
                  <th className='min-w-150px'>Methode</th>
                  <th className='min-w-140px'>Vergütung</th>
                  <th className='min-w-140px'>Dateien</th>
                  <th className='min-w-140px'>Stand</th>
                  {user.role === 'ADMIN' && <th className='min-w-140px'>Aktion</th>}
                </tr>
              </thead>
              <tbody>
                {allProjects.length > 0 ? (
                  allProjects.map((project: any) => (
                    <tr>
                      <td>
                        <div className='d-flex align-items-center'>
                          <div className='d-flex justify-content-start flex-column'>
                            {project?.projectName}
                          </div>
                        </div>
                      </td>
                      {/* <td className={style.form_group_select}>
                        {project?.users.length > 0 ? (
                          <select>
                            <option value={''}>See the team</option>
                            {project.users.map((user: any, index: number) => (
                              <option key={index} value={user.userName}>
                                {user.userName}
                              </option>
                            ))}
                          </select>
                        ) : (
                          <p>No users in this project</p>
                        )}
                      </td> */}
                      <td className={style.form_group_select}>
                        {project?.users.length > 0 ? (
                          <select onChange={handleSelectChange}>
                            <option value={''}>See the team</option>
                            {project.users.map((user: any, index: number) => (
                              <option key={index} value={user.id}>
                                {user.userName}
                              </option>
                            ))}
                          </select>
                        ) : (
                          <p>No users in this project</p>
                        )}
                      </td>
                      <td>{project?.projectInfo}</td>
                      <td>{project?.projectCompensation}</td>

                      <td>
                        {project.image && (
                          <a href={project?.image} download target='_blank' rel='noreferrer'>
                            {/* <i className='fa fa-download' aria-hidden='true'></i> */}
                            <KTSVG
                              path='/media/icons/duotune/files/fil021.svg'
                              className='svg-icon-muted svg-icon-2hx'
                            />
                          </a>
                        )}
                      </td>
                      <td>
                        <div className='d-flex flex-stack mb-2'>
                          <span className='text-muted me-2 fs-7 fw-bold'>
                            {moment(project?.createdAt).format('DD/MM/YYYY')}
                          </span>
                        </div>
                      </td>
                      <td className='text-end'>
                        <div className='d-flex flex-row w-100 me-2'>
                          {user?.role == 'MEMBER' && user?.status == 'ACTIVE' && ''}

                          {user?.role == 'ADMIN' && user?.status == 'ACTIVE' && (
                            <>
                              <div className='d-flex flex-stack mb-2'>
                                <Link
                                  to={`${/UploadProjects/}${project.id.uuid}`}
                                  className='btn btn-icon btn-bg-light btn-active-color-primary btn-sm me-1'
                                >
                                  <KTSVG
                                    path='/media/icons/duotune/art/art005.svg'
                                    className='svg-icon-3'
                                  />
                                </Link>
                              </div>
                              <div
                                className='d-flex flex-stack mb-2'
                                onClick={() => {
                                  dispatch(deleteProject(project.id.uuid))
                                }}
                              >
                                <Link
                                  to='#'
                                  className='btn btn-icon btn-bg-light btn-active-color-primary btn-sm me-1'
                                >
                                  <KTSVG
                                    path='/media/icons/duotune/general/gen027.svg'
                                    className='svg-icon-3'
                                  />
                                </Link>
                              </div>
                            </>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={5} className={style.tableNoData}>
                      Kein Projekt gefunden
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </>
  )
}
