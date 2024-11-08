import React, { Fragment } from 'react'
import { useKeycloak } from '@react-keycloak/web'
import { useTranslation } from 'react-i18next'

import IfUserLoggedIn from '../if-user-logged-in'
import IfUserLoggedOut from '../if-user-logged-out'
import IfUserInitializing from '../if-user-initializing'
import LoginButton from '../login-button'
import MenuUser from '../../menu-user'

import './LoginInNavbar.scss'

const LoginInNavbar: React.FC = () => {
  const { keycloak } = useKeycloak()
  const { t } = useTranslation()

  return (
    <Fragment>
      <IfUserLoggedIn>
        <MenuUser logout={() => keycloak.logout()} />
      </IfUserLoggedIn>

      <IfUserLoggedOut>
        <LoginButton className="sign-in-button" type="button">
          {t('login.button')}
        </LoginButton>
      </IfUserLoggedOut>

      <IfUserInitializing>
        <div className="sign-in-button">...</div>
      </IfUserInitializing>
    </Fragment>
  )
}

export default LoginInNavbar
