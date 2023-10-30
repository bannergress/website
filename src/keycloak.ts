import Keycloak from 'keycloak-js'

const keycloakConfig = {
  realm: import.meta.env.VITE_KEYCLOAK_REALM || '',
  url: import.meta.env.VITE_KEYCLOAK_URL || '',
  clientId: import.meta.env.VITE_KEYCLOAK_CLIENT_ID || '',
}

if (!import.meta.env.VITE_KEYCLOAK_CLIENT_ID) {
  throw new Error('Keycloak not configured in .env')
}

const keycloak = Keycloak(keycloakConfig)
export default keycloak
