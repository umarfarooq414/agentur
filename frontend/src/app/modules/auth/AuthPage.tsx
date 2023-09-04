/* eslint-disable jsx-a11y/anchor-is-valid */
import React, {useEffect} from 'react'
import {Redirect, Route, Switch} from 'react-router-dom'
import {Registration} from './components/Registration'
import {ForgotPassword} from './components/ForgotPassword'
import {Login} from './components/Login'
import {toAbsoluteUrl} from '../../../_metronic/helpers'
import './AuthPage.css'
import {ResetPassword} from './components/ResetPassword'
import {VerifyOtp} from './components/VerifyOtp'
import UpdatedRegistration from './components/updatedRegistrationPage/UpdatedRegistration'
import UpdatedLogin from './components/updatedLoginPage/UpdatedLogin'
export function AuthPage() {
  useEffect(() => {
    document.body.classList.add('bg-white')
    return () => {
      document.body.classList.remove('bg-white')
    }
  }, [])

  return (
    <div
      className='d-flex flex-column flex-column-fluid bgi-position-y-center position-x-center bgi-no-repeat bgi-size-cover bgi-attachment-fixed'
      style={{
        // backgroundImage: `url(${toAbsoluteUrl('/media/illustrations/sketchy-1/14.png')})`,
        backgroundImage: `url(${toAbsoluteUrl('/media/illustrations/sketchy-1/bgImage.gif')})`,
      }}
    >
      {/* begin::Content */}
      <div className='d-flex flex-center flex-column flex-column-fluid'>
        {/* begin::Logo */}
        {/* <a href='#' className='mb-12'>
          <img alt='Logo' src={toAbsoluteUrl('/media/logos/logo-1.svg')} className='h-45px' />
        </a> */}
        {/* end::Logo */}
        {/* begin::Wrapper */}
        <div className='Authpage'>
          {/* <div className='w-lg-500px bg-white rounded shadow-sm p-10 p-lg-15 mx-auto'> */}
          <Switch>
            <Route exact={true} path='/auth/login2' component={Login} />
            <Route exact={true} path='/auth/login' component={UpdatedLogin} />
            <Route exact={true} path='/auth/registration2' component={Registration} />
            <Route exact={true} path='/auth/registration' component={UpdatedRegistration} />
            <Route exact={true} path='/auth/forgot-password' component={ForgotPassword} />
            <Route exact={true} path='/auth/verify-otp' component={VerifyOtp} />
            <Route exact={true} path='/auth/reset-password' component={ResetPassword} />
            {/* <Route path='/auth/reset-password' component={ResetPassword} /> */}
            {/* <Redirect from='/auth' exact={true} to='/auth/login' /> */}
            <Redirect to='/auth/login' />
          </Switch>
        </div>
        {/* end::Wrapper */}
      </div>
      {/* end::Content */}
      {/* begin::Footer */}
      {/* <div className='d-flex flex-center flex-column-auto p-10'>
        <div className='d-flex align-items-center fw-bold fs-6'>
        <a href='#' className='text-muted text-hover-primary px-2'>
        About
        </a>
        
        <a href='#' className='text-muted text-hover-primary px-2'>
        Contact
        </a>
        
        <a href='#' className='text-muted text-hover-primary px-2'>
        Contact Us
        </a>
        </div>
      </div> */}
      {/* end::Footer */}
    </div>
  )
}
