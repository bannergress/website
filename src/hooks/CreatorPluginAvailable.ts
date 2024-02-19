import { useEffect, useState } from 'react'

const getCurrentValue = () =>
  Boolean(document.body.dataset.creatorPluginAvailable)

export const useCreatorPluginAvailable = () => {
  const [creatorPluginAvailable, setCreatorPluginAvailable] = useState(
    getCurrentValue()
  )
  useEffect(() => {
    const observer = new MutationObserver(() =>
      setCreatorPluginAvailable(getCurrentValue())
    )
    observer.observe(document.body, {
      attributes: true,
    })
    return () => observer.disconnect()
  })
  return creatorPluginAvailable
}
