/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { FC, useEffect, useState } from 'react'
import { useIntl } from 'react-intl'
import { PageTitle } from '../../../_metronic/layout/core'
import {
  ListsWidget2,
  ListsWidget4,
  ListsWidget6,
  TablesWidget5,
  // TablesWidget10,
  MixedWidget8,
} from '../../../_metronic/partials/widgets'
import { useConnection } from '../../modules/apps/chat/components/socketContext'
import { useDispatch, useSelector } from 'react-redux'
import { RootState } from '../../../setup'
import { UserModel, UserRoleEnum } from '../../modules/auth/models/UserModel'
import { ProjectsWrapper } from '../projects/Projects'
import styled from './style.module.css'
import { toast } from 'react-toastify'
const DashboardPage: FC = () => {
  // const userList = useSelector<RootState>(({user}) => user.users) as UserModel[]
  const user = useSelector<RootState>(({ auth }) => auth.user) as UserModel
  const { socket, getUserMessages, getLogoutNotifcation } = useConnection()
  socket.auth = user

  // useEffect(() => {
  //   return () => { }
  // }, [socket])
  useEffect(() => {
    // getLogoutNotifcation()
  }, [])
  return (
    <>
      <div className='row gy-12 g-xl-12'>
        {/* {user.status == 'INACTIVE' && user.role == 'MEMBER' && (
          <div className={styled.dashboard_inavtive_user}>
            <h1>
              Vielen Dank für Ihre Registration bei NTB. Sie werden per E-Mail benachrichtigt,
              sobald ihr Account freigeschaltet ist.
            </h1>
          </div>
        )} */}
        {user.status == 'ACTIVE' && user.role == 'MEMBER' && (
          <>
            {/* <div>
              {}
              <Link to={`/apps/chat/private-chat/${infoData?.sender.id}`}>
                {infoData?.sender.userName + ` messaged: ` + infoData?.content}
              </Link>
            </div> */}
            <div className='dashboard_avtive_user'>
              <ListsWidget6 className='card-xl-stretch mb-xl-12' />
              {/* <ProjectsWrapper /> */}
            </div>
          </>
        )}
        {user.status == 'ACTIVE' && user.role == 'ADMIN' && (
          <div className='dashboard_avtive_user'>
            <ProjectsWrapper />
          </div>
        )}
      </div>

      <div className='row gy-5 g-xl-8'>
        <div className='col-xl-4'>
          <ListsWidget2 className='card-xl-stretch mb-xl-8' />
        </div>
        <div className='col-xl-4'>{/* <ListsWidget6 className='card-xl-stretch mb-xl-8' /> */}</div>
        <div className='col-xl-4'>
          <ListsWidget4 className='card-xl-stretch mb-5 mb-xl-8' items={5} />
        </div>

        <div className='row g-5 gx-xxl-8'>
          <div className='col-xxl-4'>
            <MixedWidget8
              className='card-xxl-stretch mb-xl-3'
              chartColor='success'
              chartHeight='150px'
            />
          </div>
          <div className='col-xxl-8'>
            <TablesWidget5 className='card-xxl-stretch mb-5 mb-xxl-8' />
          </div>
        </div>
      </div>
    </>
  )
}

const DashboardWrapper: FC = () => {
  const intl = useIntl()
  const { socket } = useConnection()
  useEffect(() => { }, [socket])

  return (
    <>
      <PageTitle breadcrumbs={[]}>{intl.formatMessage({ id: 'MENU.DASHBOARD' })}</PageTitle>
      <DashboardPage />

    </>
  )
}
export { DashboardWrapper }
