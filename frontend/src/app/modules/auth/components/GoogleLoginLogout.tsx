/* eslint-disable no-restricted-globals */
import { GoogleLogin } from '@react-oauth/google'
import jwt_decode from 'jwt-decode'
import { useHistory } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import './socialLoginMain.css'
import * as auth from '../redux/AuthRedux'
import { socialLogin } from '../redux/AuthCRUD'
export default function LoginLogout() {
  const history = useHistory()
  const dispatch = useDispatch()

  return (
    <div className='googleAuth'>
      <GoogleLogin
        onSuccess={async (credentialResponse) => {
          const token: string = credentialResponse.credential as string
          try {
            const res = await socialLogin(token, 'google')
            const { user, access_token } = res.data
            const decoded: any = jwt_decode(token as string)
            if (decoded.email_verified === true) {
              dispatch(auth.actions.login(access_token))
              dispatch(auth.actions.setUser(user))
              history.push('/dashboard')
            }
          } catch (err) {
            dispatch(auth.actions.setError('Your account needs approval from an administrator.'))
          }
        }}
        onError={() => {
          dispatch(auth.actions.setError('There is an issue with your account'))
        }}
      />
      <div className='text-center'></div>
    </div>
  )
}
