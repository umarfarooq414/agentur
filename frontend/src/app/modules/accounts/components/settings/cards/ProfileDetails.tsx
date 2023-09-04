import React, {useState} from 'react'
// import {toAbsoluteUrl} from '../../../../../../_metronic/helpers'
import {IProfileDetails, profileDetailsInitValues as initialValues} from '../SettingsModel'
import * as Yup from 'yup'
import {useFormik} from 'formik'
import {useSelector, shallowEqual, useDispatch} from 'react-redux'
import {RootState} from '../../../../../../setup'
import {UserModel} from '../../../../auth/models/UserModel'
import {updateUserDetails} from '../../../../../../_metronic/partials/widgets/tables/redux/usersAction'

const profileDetailsSchema = Yup.object().shape({
  fName: Yup.string().required('Vorname ist erforderlich'),
  lName: Yup.string().required('Nachname ist erforderlich'),
  company: Yup.string().required('Company name is required'),
  contactPhone: Yup.string().required('Contact phone is required'),
  companySite: Yup.string().required('Company site is required'),
  country: Yup.string().required('Country is required'),
  language: Yup.string().required('Language is required'),
  timeZone: Yup.string().required('Time zone is required'),
  currency: Yup.string().required('Currency is required'),
})

const ProfileDetails: React.FC = () => {
  const [data, setData] = useState<IProfileDetails>(initialValues)
  const updateData = (fieldsToUpdate: Partial<IProfileDetails>): void => {
    const updatedData = Object.assign(data, fieldsToUpdate)
    setData(updatedData)
  }

  const [loading, setLoading] = useState(false)
  const formik = useFormik<IProfileDetails>({
    initialValues,
    validationSchema: profileDetailsSchema,
    onSubmit: (values) => {
      setLoading(true)
      setTimeout(() => {
        values.communications.email = data.communications.email
        values.communications.phone = data.communications.phone
        values.allowMarketing = data.allowMarketing
        const updatedData = Object.assign(data, values)
        setData(updatedData)
        setLoading(false)
      }, 1000)
    },
  })
  const user = useSelector<RootState>(({auth}) => auth.user, shallowEqual) as UserModel
  const status = useSelector<RootState>(({user}) => user.updatedUser, shallowEqual) as UserModel

  const dispatch = useDispatch()
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault()
    formik.setSubmitting(true)
    setLoading(true)
    dispatch(updateUserDetails(firstName, lastName))
    formik.setSubmitting(false)
  }

  return (
    <div className='card mb-5 mb-xl-10'>
      <div
        className='card-header border-0 cursor-pointer'
        role='button'
        data-bs-toggle='collapse'
        data-bs-target='#kt_account_profile_details'
        aria-expanded='true'
        aria-controls='kt_account_profile_details'
      >
        <div className='card-title m-0'>
          <h3 className='fw-bolder m-0'>Profil Details</h3>
        </div>
      </div>

      <div id='kt_account_profile_details' className='collapse show'>
        <form noValidate className='form'>
          <div className='card-body border-top p-9'>
            <div className='row mb-6'>
              <label className='col-lg-4 col-form-label required fw-bold fs-6'>Vorname</label>

              <div className='col-lg-8'>
                <div className='row'>
                  <div className='col-lg-6 fv-row'>
                    <input
                      className='form-control form-control-lg form-control-solid mb-3 mb-lg-0'
                      type='text'
                      placeholder={user.firstName}
                      onChange={(event) => setFirstName(event.target.value)}
                      value={firstName}
                    />
                    {formik.touched.fName && formik.errors.fName && (
                      <div className='fv-plugins-message-container'>
                        <div className='fv-help-block'>{formik.errors.fName}</div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            <div className='row mb-6'>
              <label className='col-lg-4 col-form-label required fw-bold fs-6'>Nachname</label>

              <div className='col-lg-8'>
                <div className='row'>
                  <div className='col-lg-6 fv-row'>
                    <input
                      className='form-control form-control-lg form-control-solid mb-3 mb-lg-0'
                      type='text'
                      placeholder={user.lastName}
                      onChange={(event) => setLastName(event.target.value)}
                      value={lastName}
                    />
                    {formik.touched.lName && formik.errors.lName && (
                      <div className='fv-plugins-message-container'>
                        <div className='fv-help-block'>{formik.errors.lName}</div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className='card-footer d-flex justify-content-end py-6 px-9'>
            <button type='submit' className='btn btn-primary' onClick={handleSubmit}>
              {/* {!loading && 'Änderungen speichern'} */}
              {loading ? (
                <span className='indicator-progress' style={{display: 'block'}}>
                  Please wait...
                  <span
                    className='spinner-border spinner-border-sm align-middle ms-2'
                    role='status'
                    aria-hidden='true'
                  ></span>
                </span>
              ) : (
                <span className='indicator-label'>Änderungen speichern</span>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export {ProfileDetails}
