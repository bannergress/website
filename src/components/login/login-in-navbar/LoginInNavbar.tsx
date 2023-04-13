import React, { Fragment } from 'react'
import { useKeycloak } from '@react-keycloak/web'
import { Trans } from 'react-i18next'

import IfUserLoggedIn from '../if-user-logged-in'
import IfUserLoggedOut from '../if-user-logged-out'
import IfUserInitializing from '../if-user-initializing'
import LoginButton from '../login-button'
import MenuUser from '../../menu-user'

import './Login-in-navbar.less'

const LoginInNavbar: React.FC = () => {
  const { keycloak } = useKeycloak()

  return (
    <Fragment>
      <IfUserLoggedIn>
        <MenuUser logout={() => keycloak.logout()} />
      </IfUserLoggedIn>

      <IfUserLoggedOut>
        <LoginButton className="sign-in-button" type="button">
          <Trans i18nKey="login.button">Sign In</Trans>
        </LoginButton>
      </IfUserLoggedOut>

      <IfUserInitializing>
        <div className="sign-in-button">...</div>
      </IfUserInitializing>
    </Fragment>
  )
}

export default LoginInNavbar
