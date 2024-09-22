import React from 'react'
import { Redirect, Route, RouteProps } from 'react-router-dom'
import { useTranslation } from 'react-i18next'

import { useUserLoggedIn } from '../../../hooks/UserLoggedIn'
import LoadingOverlay from '../../loading-overlay'

export const PrivateRoute: React.FC<PrivateRouteProps> = ({
  component: Component,
  roles,
  adminRoles,
  ...rest
}) => {
  const { authenticated, initialized } = useUserLoggedIn(roles)
  const { authenticated: admin } = useUserLoggedIn(adminRoles)
  const { t } = useTranslation()

  return (
    <Route
      {...rest}
      render={(props) => {
        if (!initialized) {
          return <LoadingOverlay active text={t('login.checking')} />
        }
        if (authenticated) {
          return <Component {...props} admin={admin} />
        }
        return <Redirect to={{ pathname: '/' }} />
      }}
    />
  )
}

export interface PrivateRouteProps extends RouteProps {
  component: React.ComponentType<any>
  roles?: string
  adminRoles?: string
}
