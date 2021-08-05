import React, { Fragment } from 'react'
import { useKeycloak } from '@react-keycloak/web'

import IfUserLoggedIn from '../if-user-logged-in'
import IfUserLoggedOut from '../if-user-logged-out'
import IfUserInitializing from '../if-user-initializing'
import LoginButton from '../login-button'

import './Login-in-navbar.less'
import MenuUser from '../../menu-user'

const LoginInNavbar: React.FC = () => {
  const { keycloak } = useKeycloak()
  const idTokenParsed = (keycloak.idTokenParsed as any) || {}
  const user = {
    picture: idTokenParsed.picture,
  }

  return (
    <Fragment>
      <IfUserLoggedIn>
        <MenuUser user={user} logout={() => keycloak.logout()} />
      </IfUserLoggedIn>

      <IfUserLoggedOut>
        <LoginButton className="sign-in-button" type="button">
          Sign In
        </LoginButton>
      </IfUserLoggedOut>

      <IfUserInitializing>
        <div className="sign-in-button">...</div>
      </IfUserInitializing>
    </Fragment>
  )
}

export default LoginInNavbar
