import React from 'react'
import { isMobile, isAndroid, isIOS } from './os'

export const createExternalNavigationUri = (
  latitude: number,
  longitude: number
) => {
  if (isMobile()) {
    if (isAndroid()) {
      return `geo:${latitude},${longitude}?q=${latitude},${longitude}`
    }
    if (isIOS()) {
      return `maps://q=${latitude},${longitude}`
    }
  }
  return `https://www.google.com/maps/dir/?api=1&destination=${latitude},${longitude}`
}

export const getExternalLinkAttributes = () =>
  ({
    rel: 'noreferrer',
    target: '_blank',
  } as React.AnchorHTMLAttributes<HTMLAnchorElement>)
