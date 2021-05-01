import React from 'react'
import {
  Redirect,
  Route,
  RouteComponentProps,
  RouteProps,
} from 'react-router-dom'
import { useUserLoggedIn } from '../../../hooks/UserLoggedIn'

export const PrivateRoute: React.FC<PrivateRouteProps> = ({
  component: Component,
  ...rest
}) => {
  const isAutherized = useUserLoggedIn()

  return (
    <Route
      {...rest}
      render={(props) => {
        return isAutherized ? (
          <Component {...props} />
        ) : (
          <Redirect to={{ pathname: '/' }} />
        )
      }}
    />
  )
}

export interface PrivateRouteProps extends RouteProps {
  component:
    | React.ComponentType<RouteComponentProps<any>>
    | React.ComponentType<any>
}
