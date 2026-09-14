import React from 'react'
import { useKeycloak } from '@react-keycloak/web'

const UserName: React.FC = () => {
  const { keycloak, initialized: keycloakInitialized } = useKeycloak()
  const username: unknown = keycloak.idTokenParsed?.preferred_username

  return (
    <>
      {keycloakInitialized && keycloak && keycloak.authenticated && (
        <>{typeof username === 'string' ? username : undefined}</>
      )}
    </>
  )
}

export default UserName
