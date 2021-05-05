import { useKeycloak } from '@react-keycloak/web'

export const useUserLoggedIn = (): [
  authenticated: boolean,
  initialized: boolean
] => {
  const { keycloak, initialized } = useKeycloak()
  return [
    (initialized && keycloak && keycloak.authenticated) === true,
    initialized,
  ]
}
