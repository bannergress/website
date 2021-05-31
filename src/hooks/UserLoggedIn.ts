import { useKeycloak } from '@react-keycloak/web'

export const useUserLoggedIn = (
  role?: string
): {
  authenticated: boolean
  initialized: boolean
} => {
  const { keycloak, initialized } = useKeycloak()
  let authenticated =
    (initialized && keycloak && keycloak.authenticated) === true
  if (role) {
    authenticated = authenticated && keycloak.hasRealmRole(role)
  }
  return {
    authenticated,
    initialized,
  }
}
