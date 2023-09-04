import { LoginSocialFacebook } from 'reactjs-social-login'
import { FacebookLoginButton } from 'react-social-login-buttons'
import './socialLoginMain.css'
import { useHistory } from 'react-router-dom'
import { useState } from 'react'
import * as auth from '../redux/AuthRedux'
import { useDispatch } from 'react-redux'
import { socialLogin } from '../redux/AuthCRUD'
// import FacebookIcon from '../../../../../public/media/icons/duotune/social/soc004.svg'
export default function FacebookLoginLogout() {
  const history = useHistory()
  const dispatch = useDispatch()

  const [profile] = useState(null)
  return (
    <div className='facebookAuth'>
      {!profile ? (
        <LoginSocialFacebook
          appId='701542265019036'
          onResolve={async (response: any) => {
            try {
              const res = await socialLogin(response.data.accessToken, 'facebook')
              const { user, access_token } = res.data
              dispatch(auth.actions.login(access_token))
              if (dispatch(auth.actions.setUser(user))) {
                history.push('/dashboard')
              }
            } catch (err) {
              dispatch(auth.actions.setError('Your account needs approval from an administrator.'))
            }
          }}
          onReject={(error) => {
            dispatch(auth.actions.setError('There is an issue with your account'))
          }}
        >
          <FacebookLoginButton />
        </LoginSocialFacebook>
      ) : (
        ''
      )}

      {/* {profile ? <div> 
        <h1>={profile.name}</h1>
        <img src={profile.picture.data.url} />
      </div>: ''} */}
    </div>
  )
}
