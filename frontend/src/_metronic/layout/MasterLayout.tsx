import React from 'react'
import { AsideDefault } from './components/aside/AsideDefault'
import { Footer } from './components/Footer'
import { HeaderWrapper } from './components/header/HeaderWrapper'
import { Toolbar } from './components/toolbar/Toolbar'
import { ScrollTop } from './components/ScrollTop'
import { Content } from './components/Content'
import { MasterInit } from './MasterInit'
import { PageDataProvider } from './core'
import {
  DrawerMessenger,
  ExploreMain,
  ActivityDrawer,
  Main,
  InviteUsers,
  UpgradePlan,
} from '../partials'
import logoImage from '../../_metronic/assets/image/img_logo.png'
import { RootState } from '../../setup'
import { useSelector } from 'react-redux'
import { UserModel } from '../../app/modules/auth/models/UserModel'
import UserVerification from '../../app/pages/userDocsVerification/UserVerification'

const MasterLayout: React.FC = ({ children }) => {
  const user = useSelector<RootState>(({ auth }) => auth.user) as UserModel
  return (
    <PageDataProvider>
      {user.status === 'INACTIVE' && user.role === 'MEMBER' ? (
        <UserVerification />
      ) : (
        <div className='page d-flex flex-row flex-column-fluid'>
          <AsideDefault />
          <div className='wrapper d-flex flex-column flex-row-fluid' id='kt_wrapper'>
            <HeaderWrapper />

            <div id='kt_content' className='content d-flex flex-column flex-column-fluid'>
              <Toolbar />
              <div className='post d-flex flex-column-fluid' id='kt_post'>
                <Content>{children}</Content>
              </div>
            </div>
            <Footer />
          </div>
        </div>
      )}

      {/* begin:: Drawers */}
      <ActivityDrawer />
      <ExploreMain />
      <DrawerMessenger />
      {/* end:: Drawers */}

      {/* begin:: Modals */}
      <Main />
      <InviteUsers />
      <UpgradePlan />
      {/* end:: Modals */}

      <MasterInit />
      <ScrollTop />
    </PageDataProvider>
  )
}

export { MasterLayout }
