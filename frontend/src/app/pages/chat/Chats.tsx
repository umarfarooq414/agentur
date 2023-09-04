/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { FC } from "react";
import { useIntl } from "react-intl";
import { PageTitle } from "../../../_metronic/layout/core";
import ChatPage from "../../modules/apps/chat/ChatPage";

const Chats: FC = () => {
  return <>
      <div className='col-xl-12'>
        <ChatPage />
      </div>
  </>;
}


const ChatWrapper: FC = () => {
  const intl = useIntl()
  return (
    <>
      <PageTitle breadcrumbs={[]}>{intl.formatMessage({id: 'MENU.USERS'})}</PageTitle>
      <Chats />
    </>
  )
}
export {ChatWrapper}
