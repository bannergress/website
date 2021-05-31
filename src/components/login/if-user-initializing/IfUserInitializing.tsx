import React, { Fragment } from 'react'
import { useKeycloak } from '@react-keycloak/web'

const IfUserInitializing: React.FC = (props) => {
  const { keycloak, initialized: keycloakInitialized } = useKeycloak()
  const { children } = props

  return (
    <Fragment>
      {(!keycloakInitialized || !keycloak) && <>{children}</>}
    </Fragment>
  )
}

export default IfUserInitializing
