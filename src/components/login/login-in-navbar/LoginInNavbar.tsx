import React, { Fragment } from 'react'
import { Row, Col, Modal } from 'antd'
import { useKeycloak } from '@react-keycloak/web'

import IfUserLoggedIn from '../if-user-logged-in'
import IfUserLoggedOut from '../if-user-logged-out'
import IfUserInitializing from '../if-user-initializing'
import { ReactComponent as SVGGoogleLogo } from '../../../img/icons/google_logo.svg'
import { ReactComponent as SVGFacebookLogo } from '../../../img/icons/facebook_logo.svg'

import './Login-in-navbar.less'
import MenuUser from '../../menu-user'

const LoginInNavbar: React.FC = () => {
  const { keycloak } = useKeycloak()
  const [modalIsOpen, setIsOpen] = React.useState(false)
  const idTokenParsed = (keycloak.idTokenParsed as any) || {}
  const user = {
    picture: idTokenParsed.picture,
  }

  function openModal() {
    setIsOpen(true)
  }

  function closeModal() {
    setIsOpen(false)
  }

  return (
    <Fragment>
      <Modal
        title="Login"
        visible={modalIsOpen}
        onCancel={closeModal}
        closable={false}
        footer={null}
        centered
      >
        <Row>
          <Col span={24}>
            <p>Login using one of these login providers</p>
          </Col>
        </Row>
        <Row>
          <Col span={12}>
            <button
              type="button"
              className="buttonLogin buttonLoginGoogle"
              onClick={() => keycloak.login({ idpHint: 'google' })}
            >
              <SVGGoogleLogo />
              Login with Google
            </button>
          </Col>
          <Col span={12}>
            <button
              type="button"
              className="buttonLogin buttonLoginFacebook"
              onClick={() => keycloak.login({ idpHint: 'facebook' })}
            >
              <SVGFacebookLogo />
              Login with Facebook
            </button>
          </Col>
        </Row>
      </Modal>

      <IfUserLoggedIn>
        <MenuUser user={user} logout={() => keycloak.logout()} />
      </IfUserLoggedIn>

      <IfUserLoggedOut>
        <button
          className="sign-in-button"
          type="button"
          onClick={() => openModal()}
        >
          Sign In
        </button>
      </IfUserLoggedOut>

      <IfUserInitializing>
        <div className="sign-in-button">...</div>
      </IfUserInitializing>
    </Fragment>
  )
}

export default LoginInNavbar
