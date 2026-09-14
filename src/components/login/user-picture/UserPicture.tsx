import React from 'react'
import { useKeycloak } from '@react-keycloak/web'
import { getSizedImageUrl } from '../../../features/utils'

const UserPicture: React.FC<UserPictureProps> = ({
  className = 'user-picture',
  size = 50,
}) => {
  const { keycloak, initialized: keycloakInitialized } = useKeycloak()
  const picture: unknown = keycloak.idTokenParsed?.picture

  return (
    <>
      {keycloakInitialized && keycloak && keycloak.authenticated && (
        <div
          className={className}
          style={{
            backgroundImage: `url('${getSizedImageUrl(
              typeof picture === 'string' ? picture : undefined,
              size,
              true
            )}')`,
          }}
        />
      )}
    </>
  )
}

export interface UserPictureProps {
  className?: string
  size?: number
}

export default UserPicture
