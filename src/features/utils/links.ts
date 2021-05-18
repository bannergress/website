import React from 'react'

export const createExternalNavigationUri = (
  latitude: number,
  longitude: number
) => {
  // Maybe can can later on decide which url to use based on the system, for example use geo: on mobile devices
  return `https://www.google.com/maps/search/?api=1&query=${latitude},${longitude}`
}

export const getExternalLinkAttributes = () =>
  ({
    rel: 'noreferrer',
    target: '_blank',
  } as React.AnchorHTMLAttributes<HTMLAnchorElement>)
