/* eslint-disable jsx-a11y/anchor-is-valid */
import React, {Fragment, useState} from 'react'
import {useDispatch, useSelector} from 'react-redux'
import * as Yup from 'yup'
import clsx from 'clsx'
import {Link} from 'react-router-dom'
import {useFormik} from 'formik'
import * as auth from '../redux/AuthRedux'
import {login} from '../redux/AuthCRUD'
import './socialLoginMain.css'
import FacebookLoginLogout from './FaceBookLoginLogout'
import {GoogleOAuthProvider} from '@react-oauth/google'
import LoginLogout from './GoogleLoginLogout'
import {errorParser} from './../../../../utils/errorHandler'
import {RootState} from '../../../../setup/redux/RootReducer'

// import {toAbsoluteUrl} from '../../../../_metronic/helpers'
// import {GoogleLogin, GoogleLogout} from 'react-google-login' // import {FacebookLogin} from 'react-facebook-login';
const loginSchema = Yup.object().shape({
  email: Yup.string()
    .email('Falsches E-Mail-Format')
    .min(3, 'Mindestens 3 Symbole')
    .max(50, 'Maximal 50 Symbole')
    .required('E-Mail ist erforderlich'),
  password: Yup.string()
    .min(3, 'Mindestens 3 Symbole')
    .max(50, 'Maximal 50 Symbole')
    .required('passwort wird benötigt'),
})

const initialValues = {
  email: '',
  password: '******',
}

/*
  Formik+YUP+Typescript:
  https://jaredpalmer.com/formik/docs/tutorial#getfieldprops
  https://medium.com/@maurice.de.beijer/yup-validation-and-typescript-and-formik-6c342578a20e
*/

export function Login() {
  const [loading, setLoading] = useState(false)
  const dispatch = useDispatch()
  const error = useSelector<RootState>((state) => state.auth.error)
  const formik = useFormik({
    initialValues,
    validationSchema: loginSchema,
    onSubmit: (values, {setStatus, setSubmitting}) => {
      setLoading(true)
      login(values.email, values.password)
        .then(({data}) => {
          const {access_token, user} = data
          dispatch(auth.actions.login(access_token))
          dispatch(auth.actions.setUser(user))
        })
        .catch((err) => {
          setSubmitting(false)
          setStatus('The login detail is incorrect')
          setStatus(errorParser(err).message ?? 'The login detail is incorrect')
          // setStatus(err.response.data.message ?? 'The login detail is incorrect')
        })
        .finally(() => setLoading(false))
    },
  })

  return (
    <form
      className='form w-100'
      onSubmit={formik.handleSubmit}
      noValidate
      id='kt_login_signin_form'
    >
      {/* begin::Heading */}

      <div className='text-center mb-10'>
        <h1 className='text-dark mb-3'>Anmelden</h1>
        <div className='text-gray-400 fw-bold fs-4'>
          Neu bei NTB?{' '}
          <Link to='/auth/registration' className='link-primary fw-bolder'>
            Zugang erstellen
          </Link>
        </div>
      </div>
      {/* begin::Heading */}

      {formik.status ? (
        <div className='mb-lg-15 alert alert-danger'>
          <div className='alert-text font-weight-bold'>{formik.status}</div>
        </div>
      ) : (
        <Fragment>
          {/* <div className='mb-10 bg-light-info p-8 rounded'>
            <div className='text-info'>
            Use account <strong>admin@demo.com</strong> and password <strong>demo</strong> to
            continue.
            </div>
          </div> */}
        </Fragment>
      )}

      {/* begin::Form group */}
      <div className='fv-row mb-10'>
        <label className='form-label fs-6 fw-bolder text-dark'>E-Mail Adresse</label>
        <input
          placeholder='E-Mail Adresse'
          {...formik.getFieldProps('email')}
          className={clsx(
            'form-control form-control-lg form-control-solid',
            {'is-invalid': formik.touched.email && formik.errors.email},
            {
              'is-valid': formik.touched.email && !formik.errors.email,
            }
          )}
          type='email'
          name='email'
          autoComplete='on'
        />
        {formik.touched.email && formik.errors.email && (
          <div className='fv-plugins-message-container'>
            <span role='alert'>{formik.errors.email}</span>
          </div>
        )}
      </div>
      {/* end::Form group */}

      {/* begin::Form group */}
      <div className='fv-row mb-10'>
        <div className='d-flex justify-content-between mt-n5'>
          <div className='d-flex flex-stack mb-2'>
            {/* begin::Label */}
            <label className='form-label fw-bolder text-dark fs-6 mb-0'>Passwort</label>
            {/* end::Label */}
            {/* begin::Link */}
            <Link
              to='/auth/forgot-password'
              className='link-primary fs-6 fw-bolder'
              style={{marginLeft: '5px'}}
            >
              Passwort vergessen?
            </Link>
            {/* end::Link */}
          </div>
        </div>
        <input
          type='password'
          autoComplete='off'
          {...formik.getFieldProps('password')}
          className={clsx(
            'form-control form-control-lg form-control-solid',
            {
              'is-invalid': formik.touched.password && formik.errors.password,
            },
            {
              'is-valid': formik.touched.password && !formik.errors.password,
            }
          )}
        />
        {formik.touched.password && formik.errors.password && (
          <div className='fv-plugins-message-container'>
            <div className='fv-help-block'>
              <span role='alert'>{formik.errors.password}</span>
            </div>
          </div>
        )}
      </div>
      {/* end::Form group */}

      {/* begin::Action */}
      <div className='text-center'>
        <button
          type='submit'
          id='kt_sign_in_submit'
          className='btn btn-lg btn-primary w-100 mb-5'
          disabled={formik.isSubmitting || !formik.isValid}
        >
          {!loading && <span className='indicator-label'>Anmelden</span>}
          {loading && (
            <span className='indicator-progress' style={{display: 'block'}}>
              Please wait...
              <span className='spinner-border spinner-border-sm align-middle ms-2'></span>
            </span>
          )}
        </button>

        {/* begin::Separator */}
        {/* <div className='text-center text-muted text-uppercase fw-bolder mb-5'>or</div> */}
        {/* end::Separator */}

        {/* begin::Google link */}
        {/* <a href='#' className='btn btn-flex flex-center btn-light btn-lg w-100 mb-5'>
          <img
            alt='Logo'
            src={toAbsoluteUrl('/media/svg/brand-logos/google-icon.svg')}
            className='h-20px me-3'
          />
          Continue with Google
        </a> */}

        {/* ************************Google and facebook Login************************* */}
        <div className='socialLoginMain'>
          <GoogleOAuthProvider clientId='365700992575-3qv20vckprpap24f24t31ieaaj3oi3ed.apps.googleusercontent.com'>
            <LoginLogout />
          </GoogleOAuthProvider>
          <FacebookLoginLogout />
        </div>
        {!!error && <p className='error-message text-danger'>{'' + error}</p>}
        {/* ************************Google and facebook Login************************* */}

        {/* <FacebookLogin
    appId="1088597931155576"
    autoLoad={true}
    fields="name,email,picture"
    onClick={componentClicked}
    callback={responseFacebook} />  */}

        {/* end::Google link */}

        {/* begin::Google link */}
        {/* <a href='#' className='btn btn-flex flex-center btn-light btn-lg w-100 mb-5'>
          <img
            alt='Logo'
            src={toAbsoluteUrl('/media/svg/brand-logos/facebook-4.svg')}
            className='h-20px me-3'
          />
          Continue with Facebook
        </a> */}
        {/* end::Google link */}

        {/* begin::Google link */}
        {/* <a href='#' className='btn btn-flex flex-center btn-light btn-lg w-100'>
          <img
            alt='Logo'
            src={toAbsoluteUrl('/media/svg/brand-logos/apple-black.svg')}
            className='h-20px me-3'
          />
          Continue with Apple
        </a> */}
        {/* end::Google link */}
      </div>
      {/* end::Action */}
    </form>
  )
}
// function redirect(arg0: string) {
//   throw new Error('Function not implemented.')
// }
