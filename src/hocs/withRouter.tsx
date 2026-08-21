import React, { useEffect, useMemo, useRef } from 'react'
import {
  useLocation,
  useNavigate,
  useNavigationType,
  useParams,
} from 'react-router-dom'

/**
 * React Router v6+ dropped the v5 history object and the withRouter/
 * RouteComponentProps APIs used by our class components. This shim
 * reconstructs the small subset of that v5 shape (location/history/match)
 * that those components rely on, backed by v6+ hooks, so the class
 * components below don't need to be rewritten as function components.
 */
export interface RouterHistory {
  push: (path: string) => void
  replace: (path: string | { pathname: string; search?: string }) => void
  goBack: () => void
  listen: (
    callback: (location: { pathname: string }, action: string) => void
  ) => () => void
}

export interface RouteComponentProps<
  Params extends Record<string, string | undefined> = Record<
    string,
    string | undefined
  >,
> {
  location: { pathname: string; search: string }
  history: RouterHistory
  match: { params: Params }
}

export function withRouter<P extends RouteComponentProps<any>>(
  Component: React.ComponentType<P>
) {
  type OwnProps = Omit<P, 'location' | 'history' | 'match'>

  const WithRouter: React.FC<OwnProps> = (props) => {
    const location = useLocation()
    const navigate = useNavigate()
    const params = useParams()
    const navigationType = useNavigationType()
    const listenersRef = useRef<
      Array<(location: { pathname: string }, action: string) => void>
    >([])
    const prevKeyRef = useRef(location.key)

    useEffect(() => {
      if (prevKeyRef.current === location.key) return
      prevKeyRef.current = location.key
      listenersRef.current.forEach((listener) =>
        listener(location, navigationType)
      )
    }, [location, navigationType])

    const history = useMemo<RouterHistory>(
      () => ({
        push: (path) => navigate(path),
        replace: (path) =>
          typeof path === 'string'
            ? navigate(path, { replace: true })
            : navigate(
                { pathname: path.pathname, search: path.search },
                { replace: true }
              ),
        goBack: () => navigate(-1),
        listen: (callback) => {
          listenersRef.current.push(callback)
          return () => {
            listenersRef.current = listenersRef.current.filter(
              (listener) => listener !== callback
            )
          }
        },
      }),
      [navigate]
    )

    const routedProps = {
      ...props,
      location,
      history,
      match: { params },
    } as unknown as P

    return <Component {...routedProps} />
  }

  return WithRouter
}
