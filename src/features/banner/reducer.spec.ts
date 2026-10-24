import { describe, expect, it, vi } from 'vitest'
import {
  BannerActionTypes,
  CACHE_BANNERS,
  CHANGE_BANNER_SETTINS,
  LOAD_BANNER,
} from './actionTypes'
import reducer from './reducer'
import { Banner, BannerListType, BannerState } from './types'

vi.mock('../../api', () => ({ api: {} }))
vi.mock('../../i18n', () => ({ default: { t: (key: string) => key } }))

const summary: Banner = {
  id: 'banner-id',
  title: 'Test banner',
  numberOfMissions: 6,
  numberOfSubmittedMissions: 0,
  numberOfDisabledMissions: 0,
  startLatitude: 0,
  startLongitude: 0,
  listType: 'todo',
}

const collections = [
  'banners',
  'fullBanners',
  'recentBanners',
  'browsedBanners',
  'searchBanners',
  'agentBanners',
  'mapBanners',
  'userBannerListBanners',
] as const

const applyAction = (
  state: BannerState | undefined,
  action: BannerActionTypes
) => reducer(state, action)

describe('banner list membership', () => {
  it.each<BannerListType>(['todo', 'done', 'blacklist', 'none'])(
    'updates every cached copy to %s without replacing full details',
    (listType) => {
      const fullBanner = {
        ...summary,
        description: 'Full details',
        missions: {},
      }
      const unrelated = { ...summary, id: 'another-banner' }
      let state: BannerState = reducer(undefined, { type: 'initial' })
      for (const key of collections) {
        state = { ...state, [key]: [fullBanner, unrelated] }
      }

      const result = applyAction(state, {
        type: CHANGE_BANNER_SETTINS,
        payload: { banner: summary, bannerSettings: { listType } },
      })
      for (const key of collections) {
        expect(result[key]).toEqual([{ ...fullBanner, listType }, unrelated])
        expect(result[key][1]).toBe(unrelated)
        expect(state[key][0]).toBe(fullBanner)
      }
    }
  )

  it('does not treat a list summary as fully loaded', () => {
    const result = applyAction(undefined, {
      type: CHANGE_BANNER_SETTINS,
      payload: { banner: summary, bannerSettings: { listType: 'done' } },
    })
    expect(result.banners).toEqual([{ ...summary, listType: 'done' }])
    expect(result.fullBanners).toEqual([])
  })

  it('caches fetched summaries without overwriting the full banner cache', () => {
    const fullBanner = { ...summary, description: 'Full details', missions: {} }
    const state = applyAction(undefined, {
      type: LOAD_BANNER,
      payload: fullBanner,
    })
    const result = applyAction(state, {
      type: CACHE_BANNERS,
      payload: [{ ...summary, listType: 'done' }],
      settingsVersionsAtRequest: state.settingsVersions,
    })
    expect(result.banners).toEqual([{ ...fullBanner, listType: 'done' }])
    expect(result.fullBanners).toEqual([fullBanner])
    expect(result.browsedBanners).toEqual([])
  })

  it('keeps a saved membership when an older summary request finishes', () => {
    const state = reducer(undefined, { type: 'initial' })
    const saved = applyAction(state, {
      type: CHANGE_BANNER_SETTINS,
      payload: { banner: summary, bannerSettings: { listType: 'done' } },
    })
    const result = applyAction(saved, {
      type: CACHE_BANNERS,
      payload: [summary],
      settingsVersionsAtRequest: state.settingsVersions,
    })
    expect(result.banners[0].listType).toBe('done')
  })

  it('accepts server membership from a request started after the last save', () => {
    const saved = applyAction(undefined, {
      type: CHANGE_BANNER_SETTINS,
      payload: { banner: summary, bannerSettings: { listType: 'done' } },
    })
    const result = applyAction(saved, {
      type: CACHE_BANNERS,
      payload: [summary],
      settingsVersionsAtRequest: saved.settingsVersions,
    })
    expect(result.banners[0].listType).toBe('todo')
  })
})
