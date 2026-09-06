import keycloak from './keycloak'
import i18n from './i18n'

type QueryValue = string | number | boolean | null | undefined
type QueryParams = Record<string, QueryValue | readonly QueryValue[]>

class Api {
  resolve: (val: unknown) => void = () => {}

  readyPromise = new Promise((resolve) => {
    this.resolve = resolve
  })

  get<T>(url: string, params: QueryParams = {}): Promise<ApiResponse<T>> {
    return this.request('GET', url, params)
  }

  delete<T>(url: string, params: QueryParams = {}): Promise<ApiResponse<T>> {
    return this.request('DELETE', url, params)
  }

  post<T>(
    url: string,
    data?: unknown,
    ignoreResponseBody = false
  ): Promise<ApiResponse<T>> {
    return this.request('POST', url, {}, data, ignoreResponseBody)
  }

  put<T>(url: string, data?: unknown): Promise<ApiResponse<T>> {
    return this.request('PUT', url, {}, data)
  }

  async request<T>(
    method: string,
    url: string,
    params: QueryParams,
    data?: unknown,
    ignoreResponseBody = false
  ): Promise<ApiResponse<T>> {
    try {
      await this.readyPromise

      const fullUrl = new URL(url, import.meta.env.VITE_API_BASE_URL)
      Object.entries(params).forEach(([key, value]) => {
        if (Array.isArray(value)) {
          fullUrl.searchParams.set(key, value.join(','))
        } else if (value !== undefined) {
          fullUrl.searchParams.set(key, String(value))
        }
      })
      const headers = await this.getHeaders()
      const response = await fetch(fullUrl.href, {
        body: data === undefined ? undefined : JSON.stringify(data),
        headers: {
          ...headers,
          ...(data !== undefined && { 'Content-Type': 'application/json' }),
        },
        method,
        mode: 'cors',
      })
      if (response.ok) {
        const json: unknown = ignoreResponseBody ? null : await response.json()
        return {
          ok: true,
          // API callers declare the endpoint's response contract here.
          data: json as T,
          status: response.status,
        }
      }
      return {
        ok: false,
        status: response.status,
      }
    } catch {
      return {
        ok: false,
        status: 500,
      }
    }
  }

  getHeaders = async () => {
    const headers: HeadersInit = {
      Accept: 'application/json',
      'Accept-Language': i18n.resolvedLanguage!,
    }
    if (keycloak.token) {
      await keycloak.updateToken(5)
      headers.Authorization = `Bearer ${keycloak.token}`
    }
    return headers
  }
}

export const api: Api = new Api()

export const updateApiState = () => {
  api.resolve(true)
}

export type ApiResponse<T> = ApiErrorResponse | ApiOkResponse<T>

export interface ApiOkResponse<T> {
  ok: true
  data: T
  status: number
}

export interface ApiErrorResponse {
  ok: false
  status: number
}
