import { useKeycloak } from '@react-keycloak/web'

export const useUserLoggedIn = () => {
  const { keycloak, initialized: keycloakInitialized } = useKeycloak()
  return keycloakInitialized && keycloak && keycloak.authenticated
}
