import React from 'react'
import { useBlocker } from 'react-router-dom'

/**
 * Replacement for React Router v5's <Prompt>, which was removed in v6+.
 * Blocking in-app navigation now requires a data router (see App.tsx) and
 * the useBlocker hook, whose blocker function may decide synchronously
 * (e.g. via window.confirm) whether to allow the navigation to proceed.
 */
export const NavigationPrompt: React.FC<NavigationPromptProps> = ({
  getMessage,
}) => {
  useBlocker(({ nextLocation }) => {
    const message = getMessage(nextLocation.pathname)
    if (message === true) return false
    // eslint-disable-next-line no-alert
    return !window.confirm(message)
  })

  return null
}

export interface NavigationPromptProps {
  getMessage: (nextPathname?: string) => true | string
}
