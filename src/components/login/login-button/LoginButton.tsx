import React, { ButtonHTMLAttributes, Fragment } from 'react'
import { Row, Col, Modal } from 'antd'
import { useKeycloak } from '@react-keycloak/web'
import { Trans, useTranslation } from 'react-i18next'

import SVGGoogleLogo from '../../../img/icons/google_logo.svg?react'
import SVGFacebookLogo from '../../../img/icons/facebook_logo.svg?react'

import './login-button.less'

const LoginButton: React.FC<ButtonHTMLAttributes<HTMLButtonElement>> = (
  attributes
) => {
  const { keycloak } = useKeycloak()
  const [modalIsOpen, setIsOpen] = React.useState(false)
  const { t } = useTranslation()

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
        title={t('login.title')}
        open={modalIsOpen}
        onCancel={closeModal}
        closable={false}
        footer={null}
        centered
      >
        <Row>
          <Col span={24}>
            <p>
              <Trans i18nKey="login.help">
                Sign in using one of these identity providers
              </Trans>
            </p>
          </Col>
        </Row>
        <Row>
          <Col span={12}>
            <button
              type="button"
              className="buttonLogin buttonLoginGoogle"
              onClick={() => keycloak.login({ idpHint: 'google' })}
            >
              <Trans i18nKey="login.google">
                <SVGGoogleLogo />
                Login with Google
              </Trans>
            </button>
          </Col>
          <Col span={12}>
            <button
              type="button"
              className="buttonLogin buttonLoginFacebook"
              onClick={() => keycloak.login({ idpHint: 'facebook' })}
            >
              <Trans i18nKey="login.facebook">
                <SVGFacebookLogo />
                Login with Facebook
              </Trans>
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
