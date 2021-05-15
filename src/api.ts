import keycloak from './keycloak'

class Api {
  resolve: (val: unknown) => void = () => {}

  readyPromise = new Promise((resolve) => {
    this.resolve = resolve
  })

  get<T>(url: string, params: {} = {}): Promise<ApiResponse<T>> {
    return this.request('GET', url, params)
  }

  delete<T>(url: string, params: {} = {}): Promise<ApiResponse<T>> {
    return this.request('DELETE', url, params)
  }

  post<T>(url: string, data?: any): Promise<ApiResponse<T>> {
    return this.request('POST', url, {}, data)
  }

  put<T>(url: string, data?: any): Promise<ApiResponse<T>> {
    return this.request('PUT', url, {}, data)
  }

  async request<T>(
    method: string,
    url: string,
    params: {},
    data?: any
  ): Promise<ApiResponse<T>> {
    try {
      await this.readyPromise

      const fullUrl = new URL(url, process.env.REACT_APP_API_BASE_URL)
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined) {
          fullUrl.searchParams.set(key, String(value))
        }
      })
      const headers = await this.getHeaders()
      const response = await fetch(fullUrl.href, {
        body: data && JSON.stringify(data),
        headers: {
          ...headers,
          ...(data && { 'Content-Type': 'application/json' }),
        },
        method,
        mode: 'cors',
      })
      const json = await response.json()
      return {
        ok: response.ok,
        data: json,
      }
    } catch (e) {
      return {
        ok: false,
      }
    }
  }

  getHeaders = async () => {
    const headers: HeadersInit = { Accept: 'application/json' }
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
}

export interface ApiErrorResponse {
  ok: false
}
