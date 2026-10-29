import { optimizeCollectionOrder } from './collectionOrder'
import type { CollectionOrderMode } from './collectionOrder'
import type { Mission } from '../mission/types'

self.onmessage = (
  event: MessageEvent<{ missions: Mission[]; mode: CollectionOrderMode }>
) => {
  try {
    self.postMessage({
      result: optimizeCollectionOrder(event.data.missions, event.data.mode),
    })
  } catch {
    self.postMessage({ error: true })
  }
}
