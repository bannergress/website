import { UAParser } from 'ua-parser-js'

export const isMobile = () => {
  const { type } = UAParser().device
  return type === UAParser.DEVICE.MOBILE || type === UAParser.DEVICE.TABLET
}

export const isAndroid = () => {
  const { name } = UAParser().os
  return name === 'Android'
}

export const isIOS = () => {
  const { name } = UAParser().os
  return name === 'iOS'
}
