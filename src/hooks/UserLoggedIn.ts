import { useKeycloak } from '@react-keycloak/web'

export const useUserLoggedIn = (): {
  authenticated: boolean
  initialized: boolean
} => {
  const { keycloak, initialized } = useKeycloak()
  return {
    authenticated: (initialized && keycloak && keycloak.authenticated) === true,
    initialized,
  }
}
