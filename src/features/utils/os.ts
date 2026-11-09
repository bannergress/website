import { UAParser } from 'ua-parser-js'

export const isMobile = () => {
  const { type } = UAParser().device
  // iPadOS can send a desktop Safari user agent in its default browsing mode.
  const touchMac =
    typeof window !== 'undefined' &&
    window.navigator.platform === 'MacIntel' &&
    window.navigator.maxTouchPoints > 1
  return (
    type === UAParser.DEVICE.MOBILE ||
    type === UAParser.DEVICE.TABLET ||
    touchMac
  )
}

export const isAndroid = () => {
  const { name } = UAParser().os
  return name === 'Android'
}

export const isIOS = () => {
  const { name } = UAParser().os
  return name === 'iOS'
}
