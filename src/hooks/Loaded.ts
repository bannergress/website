import React, { useEffect, useState } from 'react'

export const useLoaded = (ref: React.RefObject<HTMLImageElement | null>) => {
  const [complete, setComplete] = useState<boolean>(false)
  useEffect(() => {
    const image = ref.current
    if (!image) return

    const onLoad = () => setComplete(true)
    image.addEventListener('load', onLoad)
    setComplete(image.complete)
    return () => image.removeEventListener('load', onLoad)
  }, [ref])
  return complete
}
