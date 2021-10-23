import React from 'react'
import { useKeycloak } from '@react-keycloak/web'

const UserPicture: React.FC<UserPictureProps> = ({
  className = 'user-picture',
}) => {
  const { keycloak, initialized: keycloakInitialized } = useKeycloak()

  return (
    <>
      {keycloakInitialized && keycloak && keycloak.authenticated && (
        <div
          className={className}
          style={{
            backgroundImage: `url('${
              (keycloak.idTokenParsed as any).picture
            }')`,
          }}
        />
      )}
    </>
  )
}

export interface UserPictureProps {
  className?: string
}

export default UserPicture
