import React from 'react'
import {
  Redirect,
  Route,
  RouteComponentProps,
  RouteProps,
} from 'react-router-dom'
import { useUserLoggedIn } from '../../../hooks/UserLoggedIn'
import LoadingOverlay from '../../loading-overlay'

export const PrivateRoute: React.FC<PrivateRouteProps> = ({
  component: Component,
  ...rest
}) => {
  const [authenticated, initialized] = useUserLoggedIn()

  return (
    <Route
      {...rest}
      render={(props) => {
        if (!initialized) {
          return (
            <LoadingOverlay
              active
              spinner
              text="Checking Login..."
              fadeSpeed={500}
            />
          )
        }
        if (authenticated) {
          return <Component {...props} />
        }
        return <Redirect to={{ pathname: '/' }} />
      }}
    />
  )
}

export interface PrivateRouteProps extends RouteProps {
  component:
    | React.ComponentType<RouteComponentProps<any>>
    | React.ComponentType<any>
}
