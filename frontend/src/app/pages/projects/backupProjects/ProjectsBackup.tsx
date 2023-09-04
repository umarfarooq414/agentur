import React, {FC} from 'react'
import {useIntl} from 'react-intl'
import {PageTitle} from '../../../../_metronic/layout/core'
import {useState} from 'react'
import {useEffect} from 'react'
import {Projects} from './../../../modules/profile/components/Projects'
type Props = {
  className: string
}

const ProjectsWrapper: React.FC<Props> = ({className}) => {
  const [project, setProject] = useState<string[]>([])

  useEffect(() => {
    const fetchData = () => {
      fetch('Mock/MOCK_PROJECTS.json')
        .then((response) => {
          return response.json()
        })
        .then((data) => {
          setProject(data)
        })
    }
    fetchData()
  }, [])

  return (
    <>
      <div className='col-xl-12'>
        <h1>Projects</h1>
        <div className='card-body py-3'>
          <div className='table-responsive'>
            <table className='table table-row-dashed table-row-gray-300 align-middle gs-0 gy-4'>
              <thead>
                <tr className='fw-bolder text-muted'>
                  <th className='min-w-150px'>Project name</th>
                  <th className='min-w-150px'>Project info</th>
                  <th className='min-w-140px'>Dated</th>
                </tr>
              </thead>
              <tbody>
                {project.length &&
                  project.map((projects: any) => (
                    <tr>
                      <td>
                        <div className='d-flex align-items-center'>
                          <div className='d-flex justify-content-start flex-column'>
                            {projects.project_name}
                          </div>
                        </div>
                      </td>
                      <td>{projects.info}</td>
                      <td className='text-end'>
                        <div className='d-flex flex-column w-100 me-2'>
                          <div className='d-flex flex-stack mb-2'>
                            <span className='text-muted me-2 fs-7 fw-bold'>{projects.dated}</span>
                          </div>
                        </div>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </>
  )
}
export {ProjectsWrapper}
