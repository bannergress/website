import React from 'react'
import { useKeycloak } from '@react-keycloak/web'

const UserName: React.FC = () => {
  const { keycloak, initialized: keycloakInitialized } = useKeycloak()

  return (
    <>
      {keycloakInitialized && keycloak && keycloak.authenticated && (
        <>{(keycloak.idTokenParsed as any).preferred_username}</>
      )}
    </>
  )
}

export default UserName
