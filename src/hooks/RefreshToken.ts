import { handlePromise } from '../features/utils/async'
import { useKeycloak } from '@react-keycloak/web'

export const useRefreshToken = () => {
  const { keycloak } = useKeycloak()

  return () => {
    handlePromise(keycloak.updateToken(-1))
  }
}
