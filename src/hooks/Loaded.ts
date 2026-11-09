import React, { useEffect, useState } from 'react'

export const useLoaded = (
  ref: React.RefObject<HTMLImageElement | null>,
  src: string
) => {
  const [loadedSource, setLoadedSource] = useState<string>()
  useEffect(() => {
    const image = ref.current
    if (!image) return

    const onLoad = () =>
      setLoadedSource(
        image.complete && image.naturalWidth > 0 ? src : undefined
      )
    image.addEventListener('load', onLoad)
    image.addEventListener('error', onLoad)
    onLoad()
    return () => {
      image.removeEventListener('load', onLoad)
      image.removeEventListener('error', onLoad)
    }
  }, [ref, src])
  return loadedSource === src
}
