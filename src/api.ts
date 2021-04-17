import { create } from 'apisauce'
import { AuthClientTokens } from '@react-keycloak/core'

// define the api
export const api = create({
  baseURL: process.env.REACT_APP_API_BASE_URL,
  headers: { Accept: 'application/json' },
})

export const authenticateApi = (tokens: AuthClientTokens) => {
  if (tokens.token) {
    api.setHeaders({
      Authorization: `Bearer ${tokens.token}`,
    })
  }
}
