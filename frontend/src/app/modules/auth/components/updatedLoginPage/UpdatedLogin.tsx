import './agenturpage2.css'
import './daymodepage2.css'
import './responsivepage2.css'
import { toAbsoluteUrl } from '../../../../../_metronic/helpers'
import { Link } from 'react-router-dom'
import { useFormik } from 'formik'
import { useDispatch, useSelector } from 'react-redux'
import { useState } from 'react'
import clsx from 'clsx'
import * as Yup from 'yup'
import { login } from '../../redux/AuthCRUD'
import { errorParser } from '../../../../../utils/errorHandler'
import * as auth from '../../redux/AuthRedux'
export default function UpdatedLogin() {
    
  const [passwordType, setPasswordType] = useState('password');
  const [passwordIconClass, setPasswordIconClass] = useState('fa-eye');
    const [loading, setLoading] = useState(false)
    const dispatch = useDispatch()

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
        password: '',
      }
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
      const togglePasswordVisibility = () => {
        setPasswordType(prevType => prevType === 'password' ? 'text' : 'password');
        setPasswordIconClass(prevClass => prevClass === 'fa-eye-slash' ? 'fa-eye' : 'fa-eye-slash');
      };
  return (
    <form
    noValidate
    id='kt_login_signup_form'
    onSubmit={formik.handleSubmit}
  >
    <div className="bodyMainContainer" id="bodyMainContainer">
    <div className="leftMenuContainer">
        <button>
            <svg xmlns="http://www.w3.org/2000/svg" height="30px" width="26px" fill="#ffffff" viewBox="0 0 512 512">
                <path
                    d="M0 96C0 78.3 14.3 64 32 64H416c17.7 0 32 14.3 32 32s-14.3 32-32 32H32C14.3 128 0 113.7 0 96zM0 256c0-17.7 14.3-32 32-32H416c17.7 0 32 14.3 32 32s-14.3 32-32 32H32c-17.7 0-32-14.3-32-32zM448 416c0 17.7-14.3 32-32 32H32c-17.7 0-32-14.3-32-32s14.3-32 32-32H416c17.7 0 32 14.3 32 32z" />
            </svg>
        </button>
        <button>
            <svg xmlns="http://www.w3.org/2000/svg" height="30px" width="26px" fill="#ffffff" viewBox="0 0 512 512">
                <path
                    d="M352 96l64 0c17.7 0 32 14.3 32 32l0 256c0 17.7-14.3 32-32 32l-64 0c-17.7 0-32 14.3-32 32s14.3 32 32 32l64 0c53 0 96-43 96-96l0-256c0-53-43-96-96-96l-64 0c-17.7 0-32 14.3-32 32s14.3 32 32 32zm-9.4 182.6c12.5-12.5 12.5-32.8 0-45.3l-128-128c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3L242.7 224 32 224c-17.7 0-32 14.3-32 32s14.3 32 32 32l210.7 0-73.4 73.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0l128-128z" />
            </svg>
        </button>
        <button>
            <svg xmlns="http://www.w3.org/2000/svg" height="30px" width="26px" fill="#ffffff" viewBox="0 0 512 512">
                <path
                    d="M256 512A256 256 0 1 0 256 0a256 256 0 1 0 0 512zM169.8 165.3c7.9-22.3 29.1-37.3 52.8-37.3h58.3c34.9 0 63.1 28.3 63.1 63.1c0 22.6-12.1 43.5-31.7 54.8L280 264.4c-.2 13-10.9 23.6-24 23.6c-13.3 0-24-10.7-24-24V250.5c0-8.6 4.6-16.5 12.1-20.8l44.3-25.4c4.7-2.7 7.6-7.7 7.6-13.1c0-8.4-6.8-15.1-15.1-15.1H222.6c-3.4 0-6.4 2.1-7.5 5.3l-.4 1.2c-4.4 12.5-18.2 19-30.6 14.6s-19-18.2-14.6-30.6l.4-1.2zM224 352a32 32 0 1 1 64 0 32 32 0 1 1 -64 0z" />
            </svg>
        </button>
        <button>
            <svg xmlns="http://www.w3.org/2000/svg" height="30px" width="26px" fill="#ffffff" viewBox="0 0 640 512">
                <path
                    d="M384 32H512c17.7 0 32 14.3 32 32s-14.3 32-32 32H398.4c-5.2 25.8-22.9 47.1-46.4 57.3V448H512c17.7 0 32 14.3 32 32s-14.3 32-32 32H320 128c-17.7 0-32-14.3-32-32s14.3-32 32-32H288V153.3c-23.5-10.3-41.2-31.6-46.4-57.3H128c-17.7 0-32-14.3-32-32s14.3-32 32-32H256c14.6-19.4 37.8-32 64-32s49.4 12.6 64 32zm55.6 288H584.4L512 195.8 439.6 320zM512 416c-62.9 0-115.2-34-126-78.9c-2.6-11 1-22.3 6.7-32.1l95.2-163.2c5-8.6 14.2-13.8 24.1-13.8s19.1 5.3 24.1 13.8l95.2 163.2c5.7 9.8 9.3 21.1 6.7 32.1C627.2 382 574.9 416 512 416zM126.8 195.8L54.4 320H199.3L126.8 195.8zM.9 337.1c-2.6-11 1-22.3 6.7-32.1l95.2-163.2c5-8.6 14.2-13.8 24.1-13.8s19.1 5.3 24.1 13.8l95.2 163.2c5.7 9.8 9.3 21.1 6.7 32.1C242 382 189.7 416 126.8 416S11.7 382 .9 337.1z" />
            </svg>
        </button>

    </div>
    <div className="midClickContainer">
        <h3 className="midContain_Heading">Anmeldung</h3>
        <div className="midContainerWraping">
            <h4 className="midContain_registerHeading">Melden Sie sich in unseren Communities an</h4>
            <div className="midContain_inputFields">
                <label htmlFor="language">
                    <p>Sprache:</p>
                    <select name="language" id="language" className="languageInputField">
                        <option value="english">English</option>
                        <option value="german">German</option>
                        <option value="urdu">Urdu</option>
                        <option value="korean">Korean</option>
                        <option value="italian">Italian</option>
                    </select>
                </label>
                <label htmlFor="email">
                    <p>E-Mail:</p>
                    {/* <input className="registerInputField" type="email" placeholder="Enter Your E-mail" /> */}
                    <input
          placeholder='E-Mail Adresse'
          {...formik.getFieldProps('email')}
          className={clsx(
            'registerInputField',
            {'is-invalid': formik.touched.email && formik.errors.email},
            {
              'is-valid': formik.touched.email && !formik.errors.email,
            }
          )}
          type='email'
          name='email'
          autoComplete='on'
        />
                </label>
        {formik.touched.email && formik.errors.email && (
          <div className='loginErrorMessageWrapper'>
            <span role='alert'>{formik.errors.email}</span>
          </div>
        )}
                <label htmlFor="password" className="passwordfield">
      <p>Password:</p>
      <input
        type={passwordType}
        placeholder='Passwort'
        autoComplete='off'
        {...formik.getFieldProps('password')}
        className={clsx(
          'registerInputField',
          {
            'is-invalid': formik.touched.password && formik.errors.password,
          },
          {
            'is-valid': formik.touched.password && !formik.errors.password,
          }
        )}
      />
      <i className={`fa-solid ${passwordIconClass} passwordVisible`} onClick={togglePasswordVisibility}> </i>
    </label>
                {formik.touched.password && formik.errors.password && (
            <div className="errorMessageWrapper">
                <span role='alert'>{formik.errors.password}</span>
              </div>
          )}

                <button className="registerbtn">
                    <svg xmlns="http://www.w3.org/2000/svg" height="15px" width="19px" fill="#ffffff"
                        viewBox="0 0 512 512">
                        <path
                            d="M352 96l64 0c17.7 0 32 14.3 32 32l0 256c0 17.7-14.3 32-32 32l-64 0c-17.7 0-32 14.3-32 32s14.3 32 32 32l64 0c53 0 96-43 96-96l0-256c0-53-43-96-96-96l-64 0c-17.7 0-32 14.3-32 32s14.3 32 32 32zm-9.4 182.6c12.5-12.5 12.5-32.8 0-45.3l-128-128c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3L242.7 224 32 224c-17.7 0-32 14.3-32 32s14.3 32 32 32l210.7 0-73.4 73.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0l128-128z">
                        </path>
                    </svg>
                    <p>Anmeldung</p>
                </button>
                <p className="midContain_inputLastPara">Lorem, ipsum dolor sit amet consectetur adipisicing elit.
                    Eligendi ducimus nihil iusto autem quo exercitationem provident </p>
            </div>
            <div className='forgetPasswordWrap'>
            <Link
              to='/auth/forgot-password'
              className='midContain_inputLastPara'
              style={{marginLeft: '5px'}}
              >
              <span>Passwort vergessen?</span>
            </Link>
                </div>
        </div>
    </div>
    <div className="rightCotainer" style={{
        // backgroundImage: `url(${toAbsoluteUrl('/media/illustrations/sketchy-1/14.png')})`,
        backgroundImage: `url(${toAbsoluteUrl('/media/illustrations/sketchy-1/bgImage.gif')})`,
      }}>
        <div className="navbar">
            {/* <button id="daymodebtn" onClick="daymodefunc()"> */}
            {/* <button id="daymodebtn" >
                <svg aria-label="Theme icon" className="leftTabsBtn" color="rgb(255, 255, 255)"
                    fill="rgb(255, 255, 255)" height="18" role="img" viewBox="0 0 24 24" width="18">
                    <title>Theme icon</title>
                    <path
                        d="M12.00018,4.5a1,1,0,0,0,1-1V2a1,1,0,0,0-2,0V3.5A1.00005,1.00005,0,0,0,12.00018,4.5ZM5.28241,6.69678A.99989.99989,0,1,0,6.69647,5.28271l-1.06054-1.061A.99989.99989,0,0,0,4.22186,5.63574ZM4.50018,12a1,1,0,0,0-1-1h-1.5a1,1,0,0,0,0,2h1.5A1,1,0,0,0,4.50018,12Zm.78223,5.30322-1.06055,1.061a.99989.99989,0,1,0,1.41407,1.41406l1.06054-1.061a.99989.99989,0,0,0-1.41406-1.41407ZM12.00018,19.5a1.00005,1.00005,0,0,0-1,1V22a1,1,0,0,0,2,0V20.5A1,1,0,0,0,12.00018,19.5Zm6.71729-2.19678a.99989.99989,0,0,0-1.41406,1.41407l1.06054,1.061A.99989.99989,0,0,0,19.778,18.36426ZM22.00018,11h-1.5a1,1,0,0,0,0,2h1.5a1,1,0,0,0,0-2ZM18.01044,6.98975a.996.996,0,0,0,.707-.293l1.06055-1.061A.99989.99989,0,0,0,18.364,4.22168l-1.06054,1.061a1,1,0,0,0,.707,1.707ZM12.00018,6a6,6,0,1,0,6,6A6.00657,6.00657,0,0,0,12.00018,6Zm0,10a4,4,0,1,1,4-4A4.00458,4.00458,0,0,1,12.00018,16Z">
                    </path>
                </svg>
            </button> */}
            <p>Don't have an account?</p>
            <Link to="/auth/registration">Register</Link>
        </div>
        <div className="registrationInfo">
            <h2>How to Register Account</h2>
            <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Rerum maxime explicabo natus odit.
                Temporibus odio veritatis velit omnis ab aspernatur in repellat magni neque, non similique, sed
                tempore a voluptate.</p>
            <p>Lorem ipsum dolor sit amet consectetur, adipisicing elit. Enim nesciunt similique aspernatur fuga
                expedita assumenda. Nam, voluptate! Modi omnis odio rerum nam temporibus perferendis repellendus ad,
                dolorum exercitationem velit in.</p>
            <p>Lorem ipsum, dolor sit amet consectetur adipisicing elit. Reiciendis, maxime. Voluptates unde, omnis,
                eveniet iste perferendis deleniti, nam aspernatur cum exercitationem pariatur consequuntur velit
                quidem voluptatum molestiae quam expedita! Earum.</p>
            <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Voluptas nesciunt, saepe distinctio nulla
                consequatur consequuntur,</p>
            <p>Lorem ipsum dolor, sit amet consectetur adipisicing elit. Fugit, quasi?</p>
        </div>
    </div>
</div>
</form>
  )
}
