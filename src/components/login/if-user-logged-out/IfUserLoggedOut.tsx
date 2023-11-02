import React, { Fragment } from 'react'
import { useKeycloak } from '@react-keycloak/web'

const IfUserLoggedOut: React.FC<IfUserLoggedOutProps> = (props) => {
  const { keycloak, initialized: keycloakInitialized } = useKeycloak()
  const { children } = props

  return (
    <Fragment>
      {keycloakInitialized && keycloak && !keycloak.authenticated && (
        <>{children}</>
      )}
    </Fragment>
  )
}

export interface IfUserLoggedOutProps {
  children: React.ReactNode
}

export default IfUserLoggedOut
