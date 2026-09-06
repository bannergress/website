import { afterEach, describe, expect, it, vi } from 'vitest'
import { handleAsync, handlePromise } from './async'

afterEach(() => vi.restoreAllMocks())

describe('async callbacks', () => {
  it('reports a rejected operation exactly once', async () => {
    const report = vi.spyOn(console, 'error').mockImplementation(() => {})
    const error = new Error('Network unavailable')
    handlePromise(Promise.reject(error))
    await vi.waitFor(() =>
      expect(report).toHaveBeenCalledExactlyOnceWith(error)
    )
  })

  it('preserves callback arguments and handles its rejection', async () => {
    const report = vi.spyOn(console, 'error').mockImplementation(() => {})
    const error = new Error('Save failed')
    const callback = vi.fn((_id: string, _enabled: boolean) =>
      Promise.reject(error)
    )
    const handler = handleAsync(callback)
    expect(handler('banner-id', true)).toBeUndefined()
    expect(callback).toHaveBeenCalledExactlyOnceWith('banner-id', true)
    await vi.waitFor(() =>
      expect(report).toHaveBeenCalledExactlyOnceWith(error)
    )
  })

  it('accepts synchronous and successful asynchronous callbacks', async () => {
    const report = vi.spyOn(console, 'error').mockImplementation(() => {})
    handleAsync(() => {})()
    handlePromise(Promise.resolve())
    await Promise.resolve()
    expect(report).not.toHaveBeenCalled()
  })
})
