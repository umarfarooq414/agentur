import React, {useState} from 'react'
import * as Yup from 'yup'
import clsx from 'clsx'
import {Link, useHistory} from 'react-router-dom'
import {useFormik} from 'formik'
import {resetPassword} from '../redux/AuthCRUD'
import {errorParser} from '../../../../utils/errorHandler'

const initialValues = {
  password: '',
  confirmPassword: '',
}

const createNewPasswordSchema = Yup.object().shape({
  password: Yup.string()
    .min(7, 'Mindestens 3 Symbole')
    .max(50, 'Maximal 50 Symbole')
    .required('Passwort wird benötigt'),
  confirmPassword: Yup.string()
    .min(7, 'Mindestens 3 Symbole')
    .max(50, 'Maximal 50 Symbole')
    .required('Passwortbestätigung ist erforderlich')
    .when('password', {
      is: (val: string) => (val && val.length > 0 ? true : false),
      then: Yup.string().oneOf([Yup.ref('password')], "Passwort und Passwort bestätigen stimmen nicht überein"),
    }),
})

export function ResetPassword() {
  const [loading, setLoading] = useState(false)
  const [hasErrors, setHasErrors] = useState<boolean | undefined>(undefined)
  const [errorMessage, setErrorMessage] = useState<string | undefined>(undefined)
  const history = useHistory()

  const formikPassword = useFormik({
    initialValues,
    validationSchema: createNewPasswordSchema,
    onSubmit: (values, {setStatus, setSubmitting}) => {
      setLoading(true)
      setHasErrors(undefined)
      const access_token = localStorage.getItem('reset_access_token')
      resetPassword(values.password, access_token ?? '')
        .then(({data}) => {
          setHasErrors(false)
          localStorage.removeItem('reset_access_token')
          history.push('/auth/login')
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
      // form bg-white mx-auto rounded w-100 w-sm-75 w-md-50 w-lg-25
      noValidate
      id='kt_login_password_reset_form'
      onSubmit={formikPassword.handleSubmit}
    >
      <div className='text-center mb-10'>
        {/* begin::Title */}
        <h1 className='text-dark mb-3'>Passwort vergessen?</h1>
        {/* end::Title */}

        {/* begin::Link */}
        <div className='text-gray-400 fw-bold fs-4'>
          Erstellen Sie Ihr neues gesichertes Passwort.
        </div>
        {/* end::Link */}
      </div>

      {/* begin::Title */}
      {hasErrors === true && (
        <div className='mb-lg-15 alert alert-danger'>
          <div className='alert-text font-weight-bold'>{errorMessage}</div>
        </div>
      )}

      {/* end::Title */}

      {/* begin::Form group */}
      <div className='fv-row mb-10'>
        {/* <label className='form-label fw-bolder text-gray-900 fs-6'>Email</label> */}
        {/* begin::Form group Password */}
        <div className='mb-10 fv-row' data-kt-password-meter='true'>
          <div className='mb-1'>
            <label className='form-label fw-bolder text-dark fs-6'>Passwort</label>
            <div className='position-relative mb-3'>
              <input
                type='password'
                placeholder='Passwort'
                autoComplete='off'
                {...formikPassword.getFieldProps('password')}
                className={clsx(
                  'form-control form-control-lg form-control-solid',
                  {
                    'is-invalid': formikPassword.touched.password && formikPassword.errors.password,
                  },
                  {
                    'is-valid': formikPassword.touched.password && !formikPassword.errors.password,
                  }
                )}
              />
              {formikPassword.touched.password && formikPassword.errors.password && (
                <div className='fv-plugins-message-container'>
                  <div className='fv-help-block'>
                    <span role='alert'>{formikPassword.errors.password}</span>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
        {/* end::Form group */}
        {/* begin::Form group Confirm password */}
        <div className='fv-row mb-5'>
          <label className='form-label fw-bolder text-dark fs-6'>Passwort bestätigen</label>
          <input
            type='password'
            placeholder='Passwort bestätigen'
            autoComplete='off'
            {...formikPassword.getFieldProps('confirmPassword')}
            className={clsx(
              'form-control form-control-lg form-control-solid',
              {
                'is-invalid':
                  formikPassword.touched.confirmPassword && formikPassword.errors.confirmPassword,
              },
              {
                'is-valid':
                  formikPassword.touched.confirmPassword && !formikPassword.errors.confirmPassword,
              }
            )}
          />
          {formikPassword.touched.confirmPassword && formikPassword.errors.confirmPassword && (
            <div className='fv-plugins-message-container'>
              <div className='fv-help-block'>
                <span role='alert'>{formikPassword.errors.confirmPassword}</span>
              </div>
            </div>
          )}
        </div>
        {/* end::Form group */}
        {/* end::Form group */}

        {/* begin::Form group */}
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
            <Link to='/auth/login'>
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
      </div>
      {/* end::Form group */}
    </form>
  )
}
