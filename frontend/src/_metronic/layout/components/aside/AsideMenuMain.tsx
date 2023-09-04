/* eslint-disable react/jsx-no-target-blank */

import {useIntl} from 'react-intl'
import {shallowEqual, useSelector} from 'react-redux'
import {UserModel} from '../../../../app/modules/auth/models/UserModel'
import {RootState} from '../../../../setup'

import {AsideMenuItem} from './AsideMenuItem'

export function AsideMenuMain() {
  const intl = useIntl()

  const user = useSelector<RootState>(({auth}) => auth.user, shallowEqual) as UserModel
  return (
    <>
      <AsideMenuItem
        to='/dashboard'
        icon='/media/icons/duotune/art/dashboard.svg'
        title={intl.formatMessage({id: 'MENU.DASHBOARD'})}
        fontIcon='bi-app-indicator'
      />

      {user.role === 'ADMIN' && (
        <AsideMenuItem
          to='/Users'
          icon='/media/icons/duotune/art/user.svg'
          title={intl.formatMessage({id: 'Benutzer'})}
          fontIcon='bi-app-indicator'
        />
      )}
      {user.role == 'MEMBER' && user.status == 'INACTIVE' && ''}
      {user.role == 'MEMBER' && user.status == 'ACTIVE' && (
        <AsideMenuItem
          to='/Projects'
          icon='/media/icons/duotune/art/project.svg'
          title={intl.formatMessage({id: 'Projekte'})}
          fontIcon='bi-app-indicator'
        />
      )}
      {user.role == 'ADMIN' && user.status == 'ACTIVE' && (
        <AsideMenuItem
          to='/admin-verify-docs'
          icon='/media/icons/duotune/art/documentsIcon.svg'
          title={intl.formatMessage({id: 'User Documents'})}
          fontIcon='bi-app-indicator'
        />
      )}
      {user.role == 'ADMIN' && user.status == 'ACTIVE' && (
        <AsideMenuItem
          to='/UploadProjects'
          icon='/media/icons/duotune/art/uploadProject.svg'
          title={intl.formatMessage({id: 'Projekte hochladen'})}
          fontIcon='bi-app-indicator'
        />
      )}
      {user.role == 'ADMIN' && user.status == 'ACTIVE' && (
        <AsideMenuItem
          to='/Projects'
          icon='/media/icons/duotune/art/project.svg'
          title={intl.formatMessage({id: 'Projekte'})}
          fontIcon='bi-app-indicator'
        />
      )}

      {user.role == 'ADMIN' && (
        <AsideMenuItem
          to='/announcement'
          icon='/media/icons/duotune/abstract/announcement.svg'
          title={intl.formatMessage({id: 'Ankündigung'})}
          fontIcon='bi-app-indicator'
        />
      )}
      {user.status == 'ACTIVE' && (
        <AsideMenuItem
          to='/Chat'
          icon='/media/icons/duotune/art/privateChat.svg'
          title={intl.formatMessage({id: 'Support'})}
          fontIcon='bi-app-indicator'
          componentCount={true}
        />
      )}

      <div className='menu-item'>
        <div className='menu-content'>
          <div className='separator mx-1 my-4'></div>
        </div>
      </div>
    </>
  )
}
