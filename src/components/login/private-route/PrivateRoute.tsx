import React from 'react'
import { Navigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'

import { useUserLoggedIn } from '../../../hooks/UserLoggedIn'
import LoadingOverlay from '../../loading-overlay'

export const PrivateRoute: React.FC<PrivateRouteProps> = ({
  component: Component,
  roles,
  adminRoles,
}) => {
  const { authenticated, initialized } = useUserLoggedIn(roles)
  const { authenticated: admin } = useUserLoggedIn(adminRoles)
  const { t } = useTranslation()

  if (!initialized) {
    return <LoadingOverlay active text={t('login.checking')} />
  }
  if (authenticated) {
    return <Component admin={admin} />
  }
  return <Navigate to="/" replace />
}

export interface PrivateRouteProps {
  component: React.ComponentType<any>
  roles?: string
  adminRoles?: string
}
