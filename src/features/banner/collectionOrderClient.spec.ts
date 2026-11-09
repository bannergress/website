import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { calculateCollectionOrder } from './collectionOrderClient'

class TestWorker {
  static instances: TestWorker[] = []
  onmessage?: (event: { data: unknown }) => void
  onerror?: () => void
  terminate = vi.fn()
  postMessage = vi.fn()

  constructor() {
    TestWorker.instances.push(this)
  }
}

beforeEach(() => {
  TestWorker.instances = []
  vi.stubGlobal('Worker', TestWorker)
})
afterEach(() => vi.unstubAllGlobals())

describe('collection order worker client', () => {
  it('returns the worker result and terminates the worker', async () => {
    const controller = new AbortController()
    const promise = calculateCollectionOrder([], controller.signal, 'full')
    const worker = TestWorker.instances[0]
    expect(worker.postMessage).toHaveBeenCalledWith({
      missions: [],
      mode: 'full',
    })
    const result = {
      order: [1, 0],
      beforeMeters: 10,
      afterMeters: 5,
      exact: true,
      elapsedMilliseconds: 1,
    }
    worker.onmessage!({ data: { result } })
    expect(await promise).toEqual(result)
    expect(worker.terminate).toHaveBeenCalledOnce()
    controller.abort()
    expect(worker.terminate).toHaveBeenCalledOnce()
  })

  it('cancels running work and avoids spawning pre-aborted work', async () => {
    const controller = new AbortController()
    const promise = calculateCollectionOrder([], controller.signal)
    controller.abort()
    await expect(promise).rejects.toMatchObject({ name: 'AbortError' })
    expect(TestWorker.instances[0].terminate).toHaveBeenCalledOnce()
    await expect(
      calculateCollectionOrder([], controller.signal)
    ).rejects.toMatchObject({ name: 'AbortError' })
    expect(TestWorker.instances).toHaveLength(1)
  })

  it.each(['message', 'runtime'] as const)(
    'cleans up after a %s error',
    async (kind) => {
      const promise = calculateCollectionOrder([], new AbortController().signal)
      const worker = TestWorker.instances[0]
      if (kind === 'message') worker.onmessage!({ data: { error: true } })
      else worker.onerror!()
      await expect(promise).rejects.toThrow()
      expect(worker.terminate).toHaveBeenCalledOnce()
    }
  )
})
