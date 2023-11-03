import React, { ButtonHTMLAttributes, Fragment } from 'react'
import { useKeycloak } from '@react-keycloak/web'

const LoginButton: React.FC<ButtonHTMLAttributes<HTMLButtonElement>> = (
  attributes
) => {
  const { keycloak } = useKeycloak()

  function openModal() {
    keycloak.login({ idpHint: 'google' })
  }

  const { children } = attributes

  return (
    <button type="button" onClick={() => openModal()} {...attributes}>
      {children}
    </button>
  )
}

export default LoginButton
