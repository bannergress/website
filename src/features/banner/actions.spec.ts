import { beforeEach, describe, expect, it, vi } from 'vitest'
import { changeBannerSettingsAction, deleteBannerAction } from './actions'
import { changeBannerSettings, deleteBanner } from './api'
import { Banner } from './types'
import {
  BannerActionTypes,
  CHANGE_BANNER_SETTINS,
  DELETE_BANNER,
} from './actionTypes'

vi.mock('./api', () => ({
  deleteBanner: vi.fn(),
  changeBannerSettings: vi.fn(),
}))
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

describe('changeBannerSettingsAction', () => {
  it('only updates list membership after a successful save', async () => {
    let resolve!: (
      response: Awaited<ReturnType<typeof changeBannerSettings>>
    ) => void
    const response = new Promise<
      Awaited<ReturnType<typeof changeBannerSettings>>
    >((done) => {
      resolve = done
    })
    vi.mocked(changeBannerSettings).mockReturnValue(response)

    const pending = changeBannerSettingsAction(banner, { listType: 'todo' })(
      dispatch
    )
    expect(changeBannerSettings).toHaveBeenCalledWith(banner, {
      listType: 'todo',
    })
    expect(dispatched).not.toHaveBeenCalled()

    resolve({ ok: true, status: 204, data: undefined })
    await pending
    expect(dispatched).toHaveBeenCalledExactlyOnceWith({
      type: CHANGE_BANNER_SETTINS,
      payload: { banner, bannerSettings: { listType: 'todo' } },
    })
  })

  it('preserves membership when saving fails', async () => {
    vi.mocked(changeBannerSettings).mockResolvedValue({
      ok: false,
      status: 403,
    })
    await expect(
      changeBannerSettingsAction(banner, { listType: 'done' })(dispatch)
    ).rejects.toThrow('Error while changing banner settings')
    expect(dispatched).not.toHaveBeenCalled()
  })
})

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
