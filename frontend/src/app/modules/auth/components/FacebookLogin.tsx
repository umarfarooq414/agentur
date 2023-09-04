import {useState} from 'react'
import FacebookLogin from 'react-facebook-login'
import {Route, Redirect} from 'react-router-dom'

const clientId = '597021728894804'
function FacebookLoginLogout() {
  const [showloginButton, setShowloginButton] = useState(true)
  const [showlogoutButton, setShowlogoutButton] = useState(false)

  const onLoginFailure = (res: any) => {}
  const onLoginSuccess = () => {
    ;<Route exact path='/auth/registration'>
      {<Redirect to='/dashboard' />}
    </Route>
  }

  const onSignoutSuccess = () => {
    setShowloginButton(true)
    setShowlogoutButton(false)
  }

  return (
    <div>
      {showloginButton ? (
        <FacebookLogin
          appId={clientId}
          autoLoad={false}
          fields='name,email,picture'
          onClick={onLoginSuccess}
          callback={onLoginFailure}
        />
      ) : null}
    </div>
  )
}

export default FacebookLoginLogout
