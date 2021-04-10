import React, { Fragment } from 'react'
import { useKeycloak } from '@react-keycloak/web'

const IfUserLoggedIn:  React.FC = (props) => {
  
    const { keycloak, initialized : keycloakInitialized } = useKeycloak();    
    const { children } = props

    return (
      <Fragment>
        {keycloakInitialized && keycloak && keycloak.authenticated &&
          <>{children}</>
        }
      </Fragment>
    )
}


export default IfUserLoggedIn
