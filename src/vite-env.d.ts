/// <reference types="vite/client" />
/// <reference types="vite-plugin-svgr/client" />
/// <reference types="vitest" />

interface ImportMetaEnv {
  readonly VITE_API_BASE_URL: string
  readonly VITE_KEYCLOAK_CLIENT_ID: string
  readonly VITE_KEYCLOAK_REALM: string
  readonly VITE_KEYCLOAK_URL: string
  readonly VITE_USE_MOCK?: string
}
