import React from 'react'
import { MenuInnerWithSub } from '../../../_metronic/layout/components/header/MenuInnerWithSub'
import { MenuItem } from '../../../_metronic/layout/components/header/MenuItem'
const users = () => {
  return (
    <div className='col-xl-8'>
      <MenuInnerWithSub title='Support' to='/apps' menuPlacement='bottom-start' menuTrigger='click'>
        {/* PAGES */}
        <MenuInnerWithSub
          title='Support'
          to='/apps/chat'
          icon='/media/icons/duotune/communication/com012.svg'
          hasArrow={true}
          menuPlacement='right-start'
          menuTrigger={`{default:'click', lg: 'hover'}`}
        >
          <MenuItem to='/apps/chat/private-chat' title='Private Chat' hasBullet={true} />
          <MenuItem to='/apps/chat/group-chat' title='Group Chart' hasBullet={true} />
          <MenuItem to='/apps/chat/drawer-chat' title='Drawer Chart' hasBullet={true} />
        </MenuInnerWithSub>
      </MenuInnerWithSub>

    </div>
  )
}

export default users
