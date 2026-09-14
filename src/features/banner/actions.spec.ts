import { beforeEach, describe, expect, it, vi } from 'vitest'
import { deleteBannerAction } from './actions'
import { deleteBanner } from './api'
import { Banner } from './types'
import { BannerActionTypes, DELETE_BANNER } from './actionTypes'

vi.mock('./api', () => ({ deleteBanner: vi.fn() }))
vi.mock('../../api', () => ({ api: {} }))
vi.mock('../../i18n', () => ({ default: { t: (key: string) => key } }))

const banner: Banner = {
  id: 'banner-id',
  title: 'Test banner',
  numberOfMissions: 6,
  numberOfSubmittedMissions: 6,
  numberOfDisabledMissions: 0,
  startLatitude: 0,
  startLongitude: 0,
}
const dispatched = vi.fn<(action: BannerActionTypes) => void>()
const dispatch = <T extends BannerActionTypes>(action: T): T => {
  dispatched(action)
  return action
}

beforeEach(() => vi.clearAllMocks())

describe('deleteBannerAction', () => {
  it('waits for the API before removing the banner from the store', async () => {
    let resolve!: (response: Awaited<ReturnType<typeof deleteBanner>>) => void
    const response = new Promise<Awaited<ReturnType<typeof deleteBanner>>>(
      (done) => {
        resolve = done
      }
    )
    vi.mocked(deleteBanner).mockReturnValue(response)
    const pending = deleteBannerAction(banner)(dispatch)
    expect(dispatched).not.toHaveBeenCalled()
    resolve({ ok: true, status: 200, data: undefined })
    await pending
    expect(dispatched).toHaveBeenCalledExactlyOnceWith({
      type: DELETE_BANNER,
      payload: banner,
    })
  })

  it('rejects an unsuccessful response without removing the banner', async () => {
    vi.mocked(deleteBanner).mockResolvedValue({ ok: false, status: 403 })
    await expect(deleteBannerAction(banner)(dispatch)).rejects.toThrow(
      'Error while deleting banner'
    )
    expect(dispatched).not.toHaveBeenCalled()
  })

  it('propagates a network failure without removing the banner', async () => {
    const error = new Error('Connection lost')
    vi.mocked(deleteBanner).mockRejectedValue(error)
    await expect(deleteBannerAction(banner)(dispatch)).rejects.toBe(error)
    expect(dispatched).not.toHaveBeenCalled()
  })
})
