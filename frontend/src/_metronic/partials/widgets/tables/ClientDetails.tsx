import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector, shallowEqual } from 'react-redux';
import { useParams } from 'react-router-dom';
import { UserModel } from '../../../../app/modules/auth/models/UserModel';
import { RootState } from '../../../../setup';
import { GetUserDetail, UsersList } from './redux/usersAction';
type Props = {
  className: string
}
const ClientDetails : React.FC<Props> = ({className})=> {
  
  const {id}:any = useParams();
  const dispatch = useDispatch();
  const user = useSelector<RootState>(({user}) => user.userDetail, shallowEqual) as UserModel

  useEffect(() => {
    dispatch(GetUserDetail(id))
  },[])

  return (
 <div className={`card ${className}`}>
       
      {/* end::Header */}
      {/* begin::Body */}
      <div className='card-body py-3'>
        <div className='table-responsive'>
          <>
 {user && 
(
  <div className='card col-lg-12 mb-5 mb-xl-10'>
    <div
      className='card-header border-0 cursor-pointer'
      role='button'
      data-bs-toggle='collapse'
      data-bs-target='#kt_account_profile_details'
      aria-expanded='true'
      aria-controls='kt_account_profile_details'
    >
      <div className='card-title m-0'>
        <h3 className='fw-bolder m-0'>User Details</h3>
      </div>
    </div>

    <div id='kt_account_profile_details' className='collapse show'>
      <form className='form'>
        <div className='card-body border-top p-9'>
          

          {/* <div className='row mb-6'>
            <label className='col-lg-4 col-form-label required fw-bold fs-6'>Full Name</label>

            <div className='col-lg-8'>
              <div className='row'>
                <div className='col-lg-6 fv-row'>
                  <td>
                    <div className='fv-plugins-message-container'>
                      <div className='fv-help-block'>{user.firstName}  {user.lastName}</div>
                    </div>
                  </td>
                </div>
                <div className='col-lg-6 fv-row'>
                    <div className='fv-plugins-message-container'>
                      <div className='fv-help-block'>{user.lastName}</div>
                    </div>
                </div>
              </div>
            </div>
          </div> */}
          <div className='row mb-6 mt-3'>
            <div className='col-lg-12 fv-row'>
              <div className='d-flex align-items-center mt-3'>                 
              <label className='form-check-inline form-check-solid me-0 col-lg-3'>
              <b>Full name</b>
              </label> 
              <div className='fv-plugins-message-container col-lg-9'>
                      <div className='fv-help-block'>{user.firstName}  {user.lastName}</div>
                    </div>
                
              </div>
            </div>
          </div>
          <div className='row mb-6 mt-3'>
            <div className='col-lg-12 fv-row'>
              <div className='d-flex align-items-center mt-3'>                 
              <label className='form-check-inline form-check-solid me-0 col-lg-3'>
              <b>User id</b>
              </label> 
              <div className='fv-plugins-message-container col-lg-9'>
                      <div className='fv-help-block'>{user.id}</div>
                    </div>
                
              </div>
            </div>
          </div>

          <div className='row mb-6 mt-3'>
            <div className='col-lg-12 fv-row'>
              <div className='d-flex align-items-center mt-3'>                 
              <label className='form-check-inline form-check-solid me-0 col-lg-3'>
              <b>User Contact</b>
              </label> 
              <div className='fv-plugins-message-container col-lg-9'>
                      <div className='fv-help-block'>{user.email}</div>
                    </div>
                
              </div>
            </div>
          </div>

          <div className='row mb-6 mt-3'>
            <div className='col-lg-12 fv-row'>
              <div className='d-flex align-items-center mt-3'>                 
              <label className='form-check-inline form-check-solid me-0 col-lg-3'>
              <b>User Status</b>
              </label> 
              <div className='fv-plugins-message-container col-lg-9'>
                      <div className='fv-help-block'>{user.status}</div>
                    </div>
                
              </div>
            </div>
          </div>
          <div className='row mb-6 mt-3'>
            <div className='col-lg-12 fv-row'>
              <div className='d-flex align-items-center mt-3'>                 
              <label className='form-check-inline form-check-solid me-0 col-lg-3'>
              <b>User role</b>
              </label> 
              <div className='fv-plugins-message-container col-lg-9'>
                      <div className='fv-help-block'>{user.role}</div>
                    </div>
                
              </div>
            </div>
          </div>


        </div>
      </form>
    </div>
  </div>
)
// ***********************************
          }
          </>
        </div>
      </div>
    </div>





  )






} 

export default ClientDetails;
