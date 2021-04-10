import Keycloak from 'keycloak-js'

const keycloakConfig = {
  realm: 'bannergress-test',
  url: 'https://login.bannergress.com/auth/',
  clientId: 'bannergress-website',
}
const keycloak = Keycloak(keycloakConfig)
export default keycloak
