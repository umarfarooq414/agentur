/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable jsx-a11y/anchor-is-valid */
import { GoogleOAuthProvider } from '@react-oauth/google'
import { useState } from 'react'
import { useDispatch } from 'react-redux'
import { useFormik } from 'formik'
import * as Yup from 'yup'
import clsx from 'clsx'
import * as auth from '../redux/AuthRedux'
import { register } from '../redux/AuthCRUD'
import { Link, useHistory } from 'react-router-dom'
import LoginLogout from './GoogleLoginLogout'
import './socialLoginMain.css'
import FacebookLoginLogout from './FaceBookLoginLogout'
import { errorParser } from './../../../../utils/errorHandler'
import { useConnection } from '../../apps/chat/components/socketContext'
import { Socket } from 'net'
const Google_Client_Id = process.env.GOOGLE_CLIENT_ID || 'api'

const initialValues = {
  userName: '',
  firstName: '',
  lastName: '',
  email: '',
  password: '',
  changepassword: '',
  acceptTerms: false,
}

const registrationSchema = Yup.object().shape({
  firstName: Yup.string()
    .min(3, 'Mindestens 3 Symbole')
    .max(50, 'Maximal 50 Symbole')
    .required('Vorname ist erforderlich'),
  userName: Yup.string()
    .min(3, 'Mindestens 3 Symbole')
    .max(50, 'Maximal 50 Symbole')
    .required('Benutzername (Vor und Nachname) is required'),
  email: Yup.string()
    .email('Falsches E-Mail-Format')
    .min(3, 'Mindestens 3 Symbole')
    .max(50, 'Maximal 50 Symbole')
    .required('E-Mailadresse wird benötigt'),
  lastName: Yup.string()
    .min(3, 'Mindestens 3 Symbole')
    .max(50, 'Maximal 50 Symbole')
    .required('Nachname ist erforderlich'),
  password: Yup.string()
    .min(3, 'Mindestens 3 Symbole')
    .max(50, 'Maximal 50 Symbole')
    .required('Passwort wird benötigt'),
  changepassword: Yup.string()
    .required('Passwortbestätigung ist erforderlich')
    .when('password', {
      is: (val: string) => (val && val.length > 0 ? true : false),
      then: Yup.string().oneOf([Yup.ref('password')], 'Passwort stimmt nicht überein'),
    }),
  acceptTerms: Yup.bool().required('Du musst die Geschäftsbedingungen akzeptieren'),
})

export function Registration() {
  const [loading, setLoading] = useState(false)
  const history = useHistory()
  const dispatch = useDispatch()
  const formik = useFormik({
    initialValues,
    validationSchema: registrationSchema,
    onSubmit: (values, { setStatus, setSubmitting }) => {
      setLoading(true)
      register(values.email, values.userName, values.firstName, values.lastName, values.password)
        .then((res) => {
          if (res.status === 201) {
            history.push('/auth/login')
          }
        })
        .catch((err) => {
          setSubmitting(false)
          setStatus(errorParser(err).message ?? 'Registration process has broken')
        })
        .finally(() => setLoading(false))
    },
  })

  return (
    <form
      className='form w-100 fv-plugins-bootstrap5 fv-plugins-framework'
      noValidate
      id='kt_login_signup_form'
      onSubmit={formik.handleSubmit}
    >
      <div className='mb-10 text-center'>
        <h1 className='text-dark mb-3'>Zugang erstellen</h1>
        <div className='text-gray-400 fw-bold fs-4'>
          Sie haben bereits einen Zugang?
          <Link to='/auth/login' className='link-primary fw-bolder' style={{ marginLeft: '5px' }}>
            Anmelnden
          </Link>
        </div>
      </div>
      <div className='socialLoginMain'>
        <GoogleOAuthProvider clientId='process.env.GOOGLE_CLIENT_ID'>
          <LoginLogout />
        </GoogleOAuthProvider>
        <FacebookLoginLogout />
      </div>
      {formik.status && (
        <div className='mb-lg-15 alert alert-danger'>
          <div className='alert-text font-weight-bold'>{formik.status}</div>
        </div>
      )}
      <div className='row fv-row mb-7'>
        <div className='col-xl-6'>
          <label className='class="form-label fw-bolder text-dark fs-6'>Vorname</label>
          <input
            placeholder='Vorname'
            type='text'
            {...formik.getFieldProps('firstName')}
            className={clsx(
              'form-control form-control-lg form-control-solid',
              {
                'is-invalid': formik.touched.firstName && formik.errors.firstName,
              },
              {
                'is-valid': formik.touched.firstName && !formik.errors.firstName,
              }
            )}
          />
          {formik.touched.firstName && formik.errors.firstName && (
            <div className='fv-plugins-message-container'>
              <div className='fv-help-block'>
                <span role='alert'>{formik.errors.firstName}</span>
              </div>
            </div>
          )}
        </div>
        <div className='col-xl-6'>
          <div className='fv-row mb-5'>
            <label className='form-label fw-bolder text-dark fs-6'>Nachname</label>
            <input
              placeholder='Nachname'
              type='text'
              {...formik.getFieldProps('lastName')}
              className={clsx(
                'form-control form-control-lg form-control-solid',
                {
                  'is-invalid': formik.touched.lastName && formik.errors.lastName,
                },
                {
                  'is-valid': formik.touched.lastName && !formik.errors.lastName,
                }
              )}
            />
            {formik.touched.lastName && formik.errors.lastName && (
              <div className='fv-plugins-message-container'>
                <div className='fv-help-block'>
                  <span role='alert'>{formik.errors.lastName}</span>
                </div>
              </div>
            )}
          </div>
        </div>
        <div className='col-xl-12'>
          <label className='class="form-label fw-bolder text-dark fs-6'>
            Benutzername (Vor und Nachname)
          </label>
          <input
            placeholder='Benutzername (Vor und Nachname)'
            type='text'
            {...formik.getFieldProps('userName')}
            className={clsx(
              'form-control form-control-lg form-control-solid',
              {
                'is-invalid': formik.touched.userName && formik.errors.userName,
              },
              {
                'is-valid': formik.touched.userName && !formik.errors.userName,
              }
            )}
          />
          {formik.touched.userName && formik.errors.userName && (
            <div className='fv-plugins-message-container'>
              <div className='fv-help-block'>
                <span role='alert'>{formik.errors.userName}</span>
              </div>
            </div>
          )}
        </div>
      </div>
      <div className='fv-row mb-7'>
        <label className='form-label fw-bolder text-dark fs-6'>E-Mail Adresse</label>
        <input
          placeholder='E-Mail Adresse'
          type='email'
          {...formik.getFieldProps('email')}
          className={clsx(
            'form-control form-control-lg form-control-solid',
            { 'is-invalid': formik.touched.email && formik.errors.email },
            {
              'is-valid': formik.touched.email && !formik.errors.email,
            }
          )}
        />
        {formik.touched.email && formik.errors.email && (
          <div className='fv-plugins-message-container'>
            <div className='fv-help-block'>
              <span role='alert'>{formik.errors.email}</span>
            </div>
          </div>
        )}
      </div>

      <div className='mb-10 fv-row' data-kt-password-meter='true'>
        <div className='mb-1'>
          <label className='form-label fw-bolder text-dark fs-6'>Passwort</label>
          <div className='position-relative mb-3'>
            <input
              type='password'
              placeholder='Passwort'
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
        </div>
      </div>
      <div className='fv-row mb-5'>
        <label className='form-label fw-bolder text-dark fs-6'>Passwort bestätigen</label>
        <input
          type='password'
          placeholder='Passwort bestätigen'
          autoComplete='off'
          {...formik.getFieldProps('changepassword')}
          className={clsx(
            'form-control form-control-lg form-control-solid',
            {
              'is-invalid': formik.touched.changepassword && formik.errors.changepassword,
            },
            {
              'is-valid': formik.touched.changepassword && !formik.errors.changepassword,
            }
          )}
        />
        {formik.touched.changepassword && formik.errors.changepassword && (
          <div className='fv-plugins-message-container'>
            <div className='fv-help-block'>
              <span role='alert'>{formik.errors.changepassword}</span>
            </div>
          </div>
        )}
      </div>
      <div className='fv-row mb-10'>
        <div className='form-check form-check-custom form-check-solid'>
          <input
            className='form-check-input'
            type='checkbox'
            id='kt_login_toc_agree'
            {...formik.getFieldProps('acceptTerms')}
          />
          <label
            className='form-check-label fw-bold text-gray-700 fs-6'
            htmlFor='kt_login_toc_agree'
          >
            Ich habe die{' '}
            <a href='https://www.agenturntb.de/gesch%C3%A4ftsbedingungen' className='ms-1 link-primary'>
              AGBs gelesen und verstanden
            </a>
            .
          </label>
          {formik.touched.acceptTerms && formik.errors.acceptTerms && (
            <div className='fv-plugins-message-container'>
              <div className='fv-help-block'>
                <span role='alert'>{formik.errors.acceptTerms}</span>
              </div>
            </div>
          )}
        </div>
      </div>
      <div className='text-center'>
        <button
          type='submit'
          id='kt_sign_up_submit'
          className='btn btn-lg btn-primary w-100 mb-5'
          disabled={formik.isSubmitting || !formik.isValid || !formik.values.acceptTerms}
        >
          {!loading && <span className='indicator-label'>Zugang erstellen</span>}
          {loading && (
            <span className='indicator-progress' style={{ display: 'block' }}>
              Please wait...{' '}
              <span className='spinner-border spinner-border-sm align-middle ms-2'></span>
            </span>
          )}
        </button>
        <Link to='/auth/login'>
          <button
            type='button'
            id='kt_login_signup_form_cancel_button'
            className='btn btn-lg btn-light-primary w-100 mb-5'
          >
            Abbrechen
          </button>
        </Link>
      </div>
    </form>
  )
}
