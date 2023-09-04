import React, {Suspense, lazy} from 'react'
import {Redirect, Route, Switch} from 'react-router-dom'
import {ChatInner, FallbackView} from '../../_metronic/partials'
import {ChatWrapper} from '../pages/chat/Chats'
import {DashboardWrapper} from '../pages/dashboard/DashboardWrapper'
import {MenuTestPage} from '../pages/MenuTestPage'
import {ProjectsWrapper} from '../pages/projects/Projects'

// import {ProjectsWrapper} from '../pages/projects/Projects'

import {Provider as AlertProvider} from 'react-alert'
import {UploadProjectsWrapper} from '../pages/upload-projects/UploadProjects'
import {UsersWrapper} from '../pages/users/Users'
import {ConnectionProvider} from '../modules/apps/chat/components/socketContext'
import {AlertTemplate, options} from '../modules/apps/chat/components/alerts'
import {useSelector} from 'react-redux'
import {UserModel} from '../modules/auth/models/UserModel'
import {RootState} from '../../setup'
import Announcement from '../pages/announcement/Announcement'
import UserVerification from '../pages/userDocsVerification/UserVerification'
import AdminVerifyDocs from '../pages/userDocsVerification/AdminVerifyDocs'
export function PrivateRoutes() {
  const user = useSelector<RootState>(({auth}) => auth.user) as UserModel

  // const BuilderPageWrapper = lazy(() => import('../pages/layout-builder/BuilderPageWrapper'))
  const ProfilePage = lazy(() => import('../modules/profile/ProfilePage'))
  const WizardsPage = lazy(() => import('../modules/wizards/WizardsPage'))
  const AccountPage = lazy(() => import('../modules/accounts/AccountPage'))
  const WidgetsPage = lazy(() => import('../modules/widgets/WidgetsPage'))
  const ChatPage = lazy(() => import('../modules/apps/chat/ChatPage'))
  const ClientDetails = lazy(
    () => import('./../../_metronic/partials/widgets/tables/ClientDetails')
  )

  return (
    <Suspense fallback={<FallbackView />}>
      {/* <ConnectionProvider> */}
      <Switch>
        <Route path='/dashboard' component={DashboardWrapper} />
        <Route path='/userVerification' component={UserVerification} />
        <Redirect from='/auth' to='/dashboard' />
        <Redirect exact from='/' to='/dashboard' />
        {user.status === 'ACTIVE' && (
          <>
            <Route path='/announcement' component={Announcement} />
            {/* <Route path='/admin-verify-docs/:paramId' component={AdminVerifyDocs} /> */}
            <Route path='/admin-verify-docs' component={AdminVerifyDocs} />
            <Route path='/users' component={UsersWrapper} />
            <Route path='/chat' component={ChatWrapper} />
            <Route path='/chatBox' component={ChatInner} />
            <Route path='/projects' component={ProjectsWrapper} />
            <Route path='/UploadProjects/:id' component={UploadProjectsWrapper} />
            <Route path='/UploadProjects' component={UploadProjectsWrapper} />
            <Route path='/crafted/pages/profile' component={ProfilePage} />
            <Route path='/crafted/pages/wizards' component={WizardsPage} />
            <Route path='/crafted/widgets' component={WidgetsPage} />
            <Route path='/crafted/account' component={AccountPage} />
            <Route path='/apps/chat' component={ChatPage} />
            <Route path='/menu-test' component={MenuTestPage} />
            <Route path='/user/:id' component={ClientDetails} />
          </>
        )}
        <Redirect to='error/404' />
      </Switch>
      {/* </ConnectionProvider> */}
    </Suspense>
  )
}
