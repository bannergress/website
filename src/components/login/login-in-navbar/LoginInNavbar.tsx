import React, { Fragment } from 'react'
import { Row, Col, Modal } from 'antd'
import { useKeycloak } from '@react-keycloak/web'

import IfUserLoggedIn from '../if-user-logged-in'
import IfUserLoggedOut from '../if-user-logged-out'
import IfUserInitializing from '../if-user-initializing'
import UserName from '../user-name'
import { ReactComponent as SVGGoogleLogo } from '../../../img/icons/google_logo.svg'
import { ReactComponent as SVGFacebookLogo } from '../../../img/icons/facebook_logo.svg'

import './Login-in-navbar.less'

const LoginInNavbar: React.FC = () => {
  const { keycloak } = useKeycloak()
  const [modalIsOpen, setIsOpen] = React.useState(false)

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
        <button
          className="link-button"
          type="button"
          onClick={() => keycloak.logout()}
        >
          Logout <UserName />
        </button>
      </IfUserLoggedIn>

      <IfUserLoggedOut>
        <button
          className="link-button"
          type="button"
          onClick={() => openModal()}
        >
          Login
        </button>
      </IfUserLoggedOut>

      <IfUserInitializing>
        <>Checking Login...</>
      </IfUserInitializing>
    </Fragment>
  )
}

export default LoginInNavbar
