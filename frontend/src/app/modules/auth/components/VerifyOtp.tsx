import {useState} from 'react'
import * as Yup from 'yup'
import clsx from 'clsx'
import {Link, useHistory, useLocation} from 'react-router-dom'
import {useFormik} from 'formik'
import {verifyOtp} from '../redux/AuthCRUD'
import {errorParser} from '../../../../utils/errorHandler'

const initialValues = {
  otp: '',
}

const resetPasswordSchema = Yup.object().shape({
  otp: Yup.string()
    .min(4, 'Mindestens 4 Symbole')
    .max(4, 'Mindestens 4 Symbole')
    .required('OTP ist erforderlich'),
})

export function VerifyOtp() {
  const [loading, setLoading] = useState(false)
  const [hasErrors, setHasErrors] = useState<boolean | undefined>(undefined)
  const [errorMessage, setErrorMessage] = useState<string | undefined>(undefined)
  const {search} = useLocation()
  const searchParams = new URLSearchParams(search)

  const history = useHistory()

  const formik = useFormik({
    initialValues,
    validationSchema: resetPasswordSchema,
    onSubmit: (values, {setStatus, setSubmitting}) => {
      setLoading(true)
      setHasErrors(undefined)
      verifyOtp(+values.otp, searchParams.get('email') || '')
        .then(({data}) => {
          localStorage.setItem('reset_access_token', (data as any).access_token)
          history.push('/auth/reset-password')
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
      onSubmit={formik.handleSubmit}
    >
      <div className='text-center mb-10'>
        <h1 className='text-dark mb-3'>Passwort vergessen?</h1>
        <div className='text-gray-400 fw-bold fs-4'>
Geben Sie Ihr OTP ein, um Ihr Passwort zurückzusetzen.</div>
      </div>

      {hasErrors === true && (
        <div className='mb-lg-15 alert alert-danger'>
          <div className='alert-text font-weight-bold'>{errorMessage}</div>
        </div>
      )}

      <div className='fv-row mb-10'>
        <label className='form-label fw-bolder text-gray-900 fs-6'>OTP</label>
        <input
          type='text'
          placeholder='1234'
          autoComplete='off'
          {...formik.getFieldProps('otp')}
          className={clsx(
            'form-control form-control-lg form-control-solid',
            {'is-invalid': formik.touched.otp && formik.errors.otp},
            {
              'is-valid': formik.touched.otp && !formik.errors.otp,
            }
          )}
        />
        {formik.touched.otp && formik.errors.otp && (
          <div className='fv-plugins-message-container'>
            <div className='fv-help-block'>
              <span role='alert'>{formik.errors.otp}</span>
            </div>
          </div>
        )}
      </div>

      <div className='d-flex flex-wrap justify-content-center pb-lg-0'>
        <button
          type='submit'
          id='kt_password_reset_submit'
          className='btn btn-lg btn-primary fw-bolder me-4 mb-lg-4 mb-4'
        >
          {loading ? (
            <span className='indicator-progress' style={{display: 'block'}}>
              Please wait...
              <span className='spinner-border spinner-border-sm align-middle ms-2'></span>
            </span>
          ) : (
            <span className='indicator-label'>
            Einreichen</span>
          )}
        </button>
        {formik.isSubmitting || !formik.isValid || loading ? (
          <button
            type='button'
            id='kt_login_password_reset_form_cancel_button'
            className='btn btn-lg btn-light-primary fw-bolder '
            disabled={formik.isSubmitting || !formik.isValid || loading}
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
              disabled={formik.isSubmitting || !formik.isValid || loading}
            >
              Stornieren
            </button>
          </Link>
        )}
      </div>
    </form>
  )
}
