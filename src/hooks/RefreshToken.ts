import { useKeycloak } from '@react-keycloak/web'

export const useRefreshToken = (): Function => {
  const { keycloak } = useKeycloak()

  return () => {
    keycloak.updateToken(-1)
  }
}
