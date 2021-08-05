import React, { ButtonHTMLAttributes, Fragment } from 'react'
import { Row, Col, Modal } from 'antd'
import { useKeycloak } from '@react-keycloak/web'

import { ReactComponent as SVGGoogleLogo } from '../../../img/icons/google_logo.svg'
import { ReactComponent as SVGFacebookLogo } from '../../../img/icons/facebook_logo.svg'

import './login-button.less'

const LoginButton: React.FC<ButtonHTMLAttributes<HTMLButtonElement>> = (
  attributes
) => {
  const { keycloak } = useKeycloak()
  const [modalIsOpen, setIsOpen] = React.useState(false)

  function openModal() {
    // Skip login chooser for now
    keycloak.login({ idpHint: 'google' })
    // setIsOpen(true)
  }

  function closeModal() {
    setIsOpen(false)
  }

  const { children } = attributes

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
            <p>Sign in using one of these identity providers</p>
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

      <button type="button" onClick={() => openModal()} {...attributes}>
        {children}
      </button>
    </Fragment>
  )
}

export default LoginButton
