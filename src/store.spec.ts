import { afterAll, describe, expect, it, vi } from 'vitest'
import { store, persistor } from './store'
import { updateSettingsAction } from './features/settings/actions'

const { session } = vi.hoisted(() => ({ session: new Map<string, string>() }))

vi.mock('./api', () => ({ api: {} }))
vi.mock('./i18n', () => ({ default: { t: (key: string) => key } }))
vi.mock('redux-persist/es/storage/session', () => ({
  default: {
    getItem: (key: string) => Promise.resolve(session.get(key) ?? null),
    setItem: (key: string, value: string) =>
      Promise.resolve(session.set(key, value)),
    removeItem: (key: string) => Promise.resolve(session.delete(key)),
  },
}))

afterAll(() => persistor.pause())

describe('Redux store', () => {
  it('initializes every reducer and ignores unrelated actions', () => {
    const state = store.getState()
    expect(state.banner.banners).toEqual([])
    expect(state.place.allPlaces).toEqual({})
    expect(state.mission.searchedMissions).toEqual([])
    store.dispatch({ type: 'unrelated/action' })
    expect(store.getState()).toBe(state)
  })

  it('dispatches settings thunks and persists settings', async () => {
    await vi.waitFor(() => expect(persistor.getState().bootstrapped).toBe(true))
    store.dispatch(updateSettingsAction({ defaultOnline: false }))
    expect(store.getState().settings.defaultOnline).toBe(false)

    await persistor.flush()
    const persisted = JSON.parse(session.get('persist:root')!) as Record<
      string,
      string
    >
    expect(
      (JSON.parse(persisted.settings) as { defaultOnline: boolean })
        .defaultOnline
    ).toBe(false)
    expect(persisted.banner).toBeUndefined()
    expect(persisted.mission).toBeUndefined()
  })
})
