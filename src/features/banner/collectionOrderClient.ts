import type { Mission } from '../mission/types'
import type {
  CollectionOrderMode,
  CollectionOrderResult,
} from './collectionOrder'

export const calculateCollectionOrder = (
  missions: readonly Mission[],
  signal: AbortSignal,
  mode: CollectionOrderMode = 'fast'
): Promise<CollectionOrderResult> =>
  new Promise((resolve, reject) => {
    if (signal.aborted) {
      reject(new DOMException('Aborted', 'AbortError'))
      return
    }
    const worker = new Worker(
      new URL('./collectionOrder.worker.ts', import.meta.url),
      {
        type: 'module',
      }
    )
    const finish = () => {
      worker.terminate()
      signal.removeEventListener('abort', abort)
    }
    const abort = () => {
      finish()
      reject(new DOMException('Aborted', 'AbortError'))
    }
    signal.addEventListener('abort', abort, { once: true })
    worker.onmessage = (
      event: MessageEvent<{ result?: CollectionOrderResult; error?: boolean }>
    ) => {
      finish()
      if (event.data.result) resolve(event.data.result)
      else reject(new Error('Collection order calculation failed'))
    }
    worker.onerror = () => {
      finish()
      reject(new Error('Collection order worker failed'))
    }
    try {
      worker.postMessage({ missions, mode })
    } catch (error) {
      finish()
      reject(
        error instanceof Error
          ? error
          : new Error('Could not send missions to worker')
      )
    }
  })
