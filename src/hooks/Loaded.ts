import useEventListener from '@use-it/event-listener'
import React, { useEffect, useState } from 'react'

export const useLoaded = (ref: React.RefObject<HTMLImageElement | null>) => {
  const [complete, setComplete] = useState<boolean>(false)
  useEventListener(
    'load',
    () => {
      setComplete(true)
    },
    ref.current
  )
  useEffect(() => {
    if (ref.current) {
      setComplete(ref.current.complete)
    }
  }, [ref])
  return complete
}
