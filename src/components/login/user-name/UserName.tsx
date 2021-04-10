import React, { Fragment } from 'react'
import { useKeycloak } from '@react-keycloak/web'

const UserName:  React.FC = () => {
  
    const { keycloak, initialized : keycloakInitialized } = useKeycloak();    

    return (
      <Fragment>
        {keycloakInitialized && keycloak && keycloak.authenticated &&
          <>{(keycloak.idTokenParsed as any).preferred_username}</>
        }
      </Fragment>
    )
}


export default UserName
