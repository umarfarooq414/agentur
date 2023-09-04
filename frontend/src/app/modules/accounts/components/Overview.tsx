/* eslint-disable jsx-a11y/anchor-is-valid */
import React from 'react'
import { useSelector, shallowEqual } from 'react-redux'
import {Link} from 'react-router-dom'
import { RootState } from '../../../../setup'
// import {KTSVG} from '../../../../_metronic/helpers'
import {
  // ChartsWidget1,
  // TablesWidget1,
  // ListsWidget5,
  // TablesWidget5,
} from '../../../../_metronic/partials/widgets'
import { UserModel } from '../../auth/models/UserModel'

export function Overview() {
  const user = useSelector<RootState>(({auth}) => auth.user, shallowEqual) as UserModel
  return (
    <>
      <div className='card mb-5 mb-xl-10' id='kt_profile_details_view'>
        <div className='card-header cursor-pointer'>
          <div className='card-title m-0'>
            <h3 className='fw-bolder m-0'>Profil details</h3>
          </div>

          <Link to='/crafted/account/settings' className='btn btn-primary align-self-center'>
          Profil bearbeiten
          </Link>
        </div>

        <div className='card-body p-9'>
          <div className='row mb-7'>
            <label className='col-lg-4 fw-bold text-muted'>Vollständiger Name</label>

            <div className='col-lg-8'>
              <span className='fw-bolder fs-6 text-dark'>{user.firstName} {user.lastName}</span>
            </div>
          </div>

          <div className='row mb-7'>
            <label className='col-lg-4 fw-bold text-muted'>Kommunikation</label>

            <div className='col-lg-8'>
              <span className='fw-bolder fs-6 text-dark'>{user.email}</span>
            </div>
          </div>

          <div className='row mb-7'>
            <label className='col-lg-4 fw-bold text-muted'>Benutzer-Rolle</label>

            <div className='col-lg-8'>
              <span className='fw-bolder fs-6 text-dark'>{user.role}</span>
            </div>
          </div>

          <div className='row mb-7'>
            <label className='col-lg-4 fw-bold text-muted'>Benutzer-ID</label>

            <div className='col-lg-8'>
              <span className='fw-bolder fs-6 text-dark'>{user.id}</span>
            </div>
          </div>
          <div className='row mb-7'>
            <label className='col-lg-4 fw-bold text-muted'>Benutzer-Status</label>

            <div className='col-lg-8'>
              <span className='fw-bolder fs-6 text-dark'>{user.status}</span>
            </div>
          </div>

        </div>
      </div>
    </>
  )
}
