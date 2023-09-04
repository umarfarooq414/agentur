import { FC, useRef, useEffect, useState } from 'react'
import { shallowEqual, useSelector, connect, useDispatch, ConnectedProps } from 'react-redux'
import { LayoutSplashScreen } from '../../../../_metronic/layout/core'
import * as auth from './AuthRedux'
import { getUserByToken } from './AuthCRUD'
import { RootState } from '../../../../setup'

const mapState = (state: RootState) => ({ auth: state.auth })
const connector = connect(mapState, auth.actions)
type PropsFromRedux = ConnectedProps<typeof connector>

const AuthInit: FC<PropsFromRedux> = (props) => {
  const didRequest = useRef(false)
  const dispatch = useDispatch()
  const [showSplashScreen, setShowSplashScreen] = useState(true)
  const access_token = useSelector<RootState>(({ auth }) => auth.access_token, shallowEqual)

  // We should request user by authToken before rendering the application
  useEffect(() => {
    const requestUser = async () => {
      try {
        if (!didRequest.current) {
          const { data: user } = await getUserByToken()
          dispatch(props.fulfillUser(user))
        }
      } catch (error) {
        if (!didRequest.current) {
          dispatch(props.logout())
        }
      } finally {
        setShowSplashScreen(false)
      }

      return () => (didRequest.current = true)
    }

    if (access_token) {
      requestUser()
    } else {
      dispatch(props.logout())
      setShowSplashScreen(false)
    }
    // eslint-disable-next-line
  }, [])

  return showSplashScreen ? <LayoutSplashScreen /> : <>{props.children}</>
}

export default connector(AuthInit)
