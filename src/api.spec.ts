import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { api, updateApiState } from './api'

vi.mock('./keycloak', () => ({ default: { token: undefined } }))
vi.mock('./i18n', () => ({ default: { resolvedLanguage: 'en' } }))

const fetchMock = vi.fn<typeof fetch>()

beforeEach(() => {
  vi.stubEnv('VITE_API_BASE_URL', 'https://example.test/')
  vi.stubGlobal('fetch', fetchMock)
  fetchMock.mockReset()
  updateApiState()
})
afterEach(() => {
  vi.unstubAllGlobals()
  vi.unstubAllEnvs()
})

describe('API requests', () => {
  it('encodes query values and returns the response', async () => {
    fetchMock.mockResolvedValue(Response.json({ id: 'banner-id' }))
    const result = await api.get<{ id: string }>('banners', {
      online: false,
      offset: 0,
      places: ['Berlin', 'Hamburg'],
      missing: undefined,
    })
    expect(result).toEqual({ ok: true, data: { id: 'banner-id' }, status: 200 })
    const input = fetchMock.mock.calls[0][0]
    if (typeof input !== 'string') throw new Error('Expected a URL string')
    const url = new URL(input)
    expect(Object.fromEntries(url.searchParams)).toEqual({
      online: 'false',
      offset: '0',
      places: 'Berlin,Hamburg',
    })
  })

  it('sends falsy JSON bodies with the correct content type', async () => {
    fetchMock.mockResolvedValue(Response.json(null))
    await api.post('settings', false)
    expect(fetchMock.mock.calls[0][1]).toMatchObject({
      method: 'POST',
      body: 'false',
      headers: { 'Content-Type': 'application/json' },
    })
  })

  it('accepts an empty response when the endpoint does not return JSON', async () => {
    fetchMock.mockResolvedValue(new Response(null, { status: 204 }))
    await expect(api.post('submit', undefined, true)).resolves.toEqual({
      ok: true,
      status: 204,
      data: null,
    })
  })

  it('returns HTTP and network failures as unsuccessful responses', async () => {
    fetchMock.mockResolvedValue(new Response(null, { status: 403 }))
    await expect(api.get('private')).resolves.toEqual({
      ok: false,
      status: 403,
    })
    fetchMock.mockRejectedValue(new Error('Connection lost'))
    await expect(api.get('banners')).resolves.toEqual({
      ok: false,
      status: 500,
    })
  })
})
