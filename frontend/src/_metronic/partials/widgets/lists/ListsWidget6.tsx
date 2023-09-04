/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useEffect, useLayoutEffect, useMemo, useState } from 'react'
import { useSelector } from 'react-redux'
import { toast } from 'react-toastify'
import { useConnection } from '../../../../app/modules/apps/chat/components/socketContext'
import { UserModel } from '../../../../app/modules/auth/models/UserModel'
import { RootState } from '../../../../setup'
import { KTSVG } from '../../../helpers'
import { IAnnouncement } from '../../../helpers/userData'
type Props = {
  className: string
}

const ListsWidget6: React.FC<Props> = ({ className }) => {
  const user = useSelector<RootState>(({ auth }) => auth.user) as UserModel
  const { socket, setInfoData, infoData, getAnnouncements, receiveAnnouncement } = useConnection()

  socket.auth = user

  useEffect(() => {
    socket.on('deleteAnnouncement', (data: IAnnouncement) => {
      setInfoData((prevAnnouncements) =>
        prevAnnouncements.filter((announcement) => announcement.id !== data?.id)
      );
    })
    getAnnouncements()
    receiveAnnouncement()
  }, [])

  const uniqueAnnouncements = infoData.filter((announcement, index, self) => {
    return index === self.findIndex(a => a.id === announcement.id);
  });

  const sortedData = uniqueAnnouncements.sort((a: IAnnouncement, b: IAnnouncement) => {
    const dateA: any = new Date(a.createdAt as Date)
    const dateB: any = new Date(b.createdAt as Date)
    return dateB - dateA
  })

  const index = uniqueAnnouncements.length
  const prev = index


  return (
    <div className='card card-xl-stretch mb-5 mb-xl-8'>
      {/* begin::Header */}
      <div className='card-header border-0'>
        <h3 className='card-title fw-bolder text-dark'>Ankündigungen</h3>
        <div className='card-toolbar'>
          {/* begin::Menu */}
          {/* <button
            type='button'
            className='btn btn-sm btn-icon btn-color-primary btn-active-light-primary'
            data-kt-menu-trigger='click'
            data-kt-menu-placement='bottom-end'
            data-kt-menu-flip='top-end'
          >
            <KTSVG path='/media/icons/duotune/general/gen024.svg' className='svg-icon-2' />
          </button> */}
          {/* <Dropdown1 /> */}
          {/* end::Menu */}
        </div>
      </div>
      {/* end::Header */}
      {/* begin::Body */}
      <div className='card-body pt-0'>
        {/* begin::Item */}
        {/* {infoData?.map((announcement: any, index: any) => ( */}
        {sortedData
          ?.sort((a: any, b: any) => new Date(b.date).getTime() - new Date(a.date).getTime())
          .map((announcement: any, index: any) => (
            <div
              className='d-flex align-items-center bg-light-warning rounded p-5 mb-7'
              style={{backgroundColor: '#2b2b3f'}}
            >
              {/* begin::Icon */}
              <span className='svg-icon svg-icon-warning me-5'>
                <KTSVG
                  path='/media/icons/duotune/abstract/announcement.svg'
                  className='svg-icon-1'
                />
              </span>
              {/* end::Icon */}
              {/* begin::Title */}
              <div className='flex-grow-1 me-2'>
                {/* <Link to={`/apps/chat/private-chat/${infoData?.sender.id}`}>
              {infoData?.sender.userName + ` : ` + infoData?.content}
            </Link> */}

                <p key={index} style={{marginBottom: '0px'}}>
                  {announcement.announcement}
                </p>

                {/* <span className='text-muted fw-bold d-block'>Due in 2 Days</span> */}
                {/* begin::Button */}
                {/* end::Button */}
              </div>
              {/* end::Title */}
              {/* begin::Lable */}
              {/* <span className='fw-bolder text-warning py-1'>+28%</span> */}
              {/* end::Lable */}
            </div>
          ))}
        {/* end::Item */}
      </div>
      {/* end::Body */}
    </div>
  )
}

export { ListsWidget6 }
