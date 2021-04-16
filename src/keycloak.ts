import Keycloak from 'keycloak-js'

const keycloakConfig = {
  realm: process.env.REACT_APP_KEYCLOAK_REALM || '',
  url: process.env.REACT_APP_KEYCLOAK_URL || '',
  clientId: process.env.REACT_APP_KEYCLOAK_CLIENT_ID || '',
}

if (!process.env.REACT_APP_KEYCLOAK_CLIENT_ID) {
  throw new Error('Keycloak not configured in .env')
}

const keycloak = Keycloak(keycloakConfig)
export default keycloak
