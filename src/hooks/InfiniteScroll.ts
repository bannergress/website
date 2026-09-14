import { handlePromise, reportError } from '../features/utils/async'
import { useCallback, useRef, useState } from 'react'

interface Options {
  callback?: () => void | Promise<unknown>
}

export const useInfiniteScroll = ({ callback }: Options) => {
  const [isFetching, setIsFetching] = useState(false)
  const observer = useRef<IntersectionObserver | undefined>(undefined)
  const ref = useRef<Element | null>(null)

  const setRef = useCallback(
    (node: Element | null) => {
      if (ref.current) {
        observer.current?.disconnect()
      }

      if (node && callback) {
        observer.current = new IntersectionObserver(
          (entries) => {
            if (!isFetching && entries[0].isIntersecting) {
              setIsFetching(true)
              handlePromise(
                Promise.resolve()
                  .then(callback)
                  .catch(reportError)
                  .finally(() => setIsFetching(false))
              )
            }
          },
          {
            rootMargin: '100px',
          }
        )
        observer.current.observe(node)
      }

      // Save a reference to the node
      ref.current = node
    },
    [callback, isFetching]
  )

  return [setRef]
}
