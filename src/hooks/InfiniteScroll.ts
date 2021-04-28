import { useCallback, useRef, useState } from 'react'

interface Options {
  callback?: () => Promise<unknown>
}

export const useInfiniteScroll = ({ callback }: Options) => {
  const [isFetching, setIsFetching] = useState(false)
  const observer = useRef<IntersectionObserver>()
  const ref = useRef(null)

  const setRef = useCallback(
    (node) => {
      if (ref.current) {
        observer.current?.disconnect()
      }

      if (node && callback) {
        observer.current = new IntersectionObserver(
          (entries) => {
            if (!isFetching && entries[0].isIntersecting) {
              setIsFetching(true)
              callback()
                .catch()
                .finally(() => setIsFetching(false))
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
