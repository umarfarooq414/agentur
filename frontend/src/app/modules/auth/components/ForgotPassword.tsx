import React, {useState} from 'react'
import * as Yup from 'yup'
import clsx from 'clsx'
import {Link} from 'react-router-dom'
import {useFormik} from 'formik'
import {requestOTP} from '../redux/AuthCRUD'
import {errorParser} from './../../../../utils/errorHandler'

const initialValues = {
  email: '',
}

const forgotPasswordSchema = Yup.object().shape({
  email: Yup.string()
    .email('Wrong email format')
    .min(3, 'Minimum 3 symbols')
    .max(50, 'Maximum 50 symbols')
    .required('E-Mail ist erforderlich'),
})

export function ForgotPassword() {
  const [loading, setLoading] = useState(false)
  const [hasErrors, setHasErrors] = useState<boolean | undefined>(undefined)
  const [errorMessage, setErrorMessage] = useState<string | undefined>(undefined)

  const formikPassword = useFormik({
    initialValues,
    validationSchema: forgotPasswordSchema,
    onSubmit: (values, {setStatus, setSubmitting}) => {
      setLoading(true)
      setHasErrors(undefined)
      requestOTP(values.email)
        .then(({data: {result}}) => {
          setHasErrors(false)
        })
        .catch((err) => {
          setHasErrors(true)
          setSubmitting(false)
          setStatus('The login detail is incorrect')
          setErrorMessage(errorParser(err).message)
        })
        .finally(() => setLoading(false))
    },
  })

  return (
    <form
      className='form w-75 w-xs-50 w-sm-50 w-md-50 w-lg-25 bg-white mx-auto rounded fv-plugins-bootstrap5 fv-plugins-framework p-10'
      noValidate
      id='kt_login_password_reset_form'
      onSubmit={formikPassword.handleSubmit}
    >
      <div className='text-center mb-10'>
        <h1 className='text-dark mb-3'>Passwort vergessen?</h1>

        <div className='text-gray-400 fw-bold fs-4'>
          Bitte geben Sie ihre E-Mail Adresse ein, um Ihr Passwort zurück zu setzen.
        </div>
      </div>

      {hasErrors === true && (
        <div className='mb-lg-15 alert alert-danger'>
          <div className='alert-text font-weight-bold'>{errorMessage}</div>
        </div>
      )}

      {hasErrors === false && (
        <>
          <div className='mb-10 bg-light-info p-8 rounded'>
            <div className='text-info'>
              Wir haben Ihnen eine E-Mail zum zurücksetzen ihres Passwortes gesendet
            </div>
          </div>
        </>
      )}

      <div className='fv-row mb-10'>
        <label className='form-label fw-bolder text-gray-900 fs-6'>E-Mail</label>
        <input
          type='email'
          placeholder='E-Mail'
          autoComplete='off'
          {...formikPassword.getFieldProps('email')}
          className={clsx(
            'form-control form-control-lg form-control-solid',
            {'is-invalid': formikPassword.touched.email && formikPassword.errors.email},
            {
              'is-valid': formikPassword.touched.email && !formikPassword.errors.email,
            }
          )}
        />
        {formikPassword.touched.email && formikPassword.errors.email && (
          <div className='fv-plugins-message-container'>
            <div className='fv-help-block'>
              <span role='alert'>{formikPassword.errors.email}</span>
            </div>
          </div>
        )}
      </div>

      <div className='d-flex flex-wrap justify-content-center pb-lg-0'>
        <button
          type='submit'
          id='kt_password_reset_submit'
          // className='btn btn-lg btn-primary fw-bolder me-4'
          className='btn btn-lg btn-primary fw-bolder me-4 mb-lg-4 mb-4'
        >
          {loading ? (
            <span className='indicator-progress' style={{display: 'block'}}>
              Please wait...
              <span className='spinner-border spinner-border-sm align-middle ms-2'></span>
            </span>
          ) : (
            <span className='indicator-label'>Einreichen</span>
          )}
        </button>
        {formikPassword.isSubmitting || !formikPassword.isValid || loading ? (
          <button
            type='button'
            id='kt_login_password_reset_form_cancel_button'
            className='btn btn-lg btn-light-primary fw-bolder'
            disabled={formikPassword.isSubmitting || !formikPassword.isValid || loading}
          >
            Stornieren
          </button>
        ) : (
          <Link to='/auth/login' >
          <button
              type='button'
              id='kt_login_password_reset_form_cancel_button'
              // className='btn btn-lg btn-light-primary fw-bolder'
              className='btn btn-lg btn-light-primary fw-bolder me-4 mb-lg-4 mb-4'
              disabled={formikPassword.isSubmitting || !formikPassword.isValid || loading}
            >
              Stornieren
            </button>
          </Link>
        )}
      </div>
    </form>
  )
}
