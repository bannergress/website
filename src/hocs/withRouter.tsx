import React, { useMemo } from 'react'
import { useLocation, useNavigate, useParams } from 'react-router-dom'
import { getRouter } from '../router-instance'
import { handlePromise } from '../features/utils/async'

/**
 * React Router v6+ dropped the v5 history object and the withRouter/
 * RouteComponentProps APIs used by our class components. This shim
 * reconstructs the small subset of that v5 shape (location/history/match)
 * that those components rely on, backed by v6+ hooks, so the class
 * components below don't need to be rewritten as function components.
 */
export interface RouterHistory {
  push: (path: string | { pathname: string; search?: string }) => void
  replace: (path: string | { pathname: string; search?: string }) => void
  goBack: () => void
  listen: (
    callback: (location: { pathname: string }, action: string) => void
  ) => () => void
}

/**
 * Subscribes directly to the app's single router instance instead of
 * reacting to this component's own location prop: a listener registered
 * that way only ever fires while its own component stays mounted, which
 * never happens for a navigation that unmounts it (e.g. leaving /browse
 * for an unrelated page) - exactly the case scroll-restoration needs to
 * observe to decide whether to discard the saved position.
 */
const listenToRouter = (
  callback: (location: { pathname: string }, action: string) => void
) => {
  const router = getRouter()
  if (!router) return () => {}

  let prevPathname = router.state.location.pathname
  return router.subscribe((state) => {
    if (state.location.pathname === prevPathname) return
    prevPathname = state.location.pathname
    callback({ pathname: state.location.pathname }, state.historyAction)
  })
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

export function withRouter<P extends RouteComponentProps>(
  Component: React.ComponentType<P>
) {
  type OwnProps = Omit<P, 'location' | 'history' | 'match'>

  const WithRouter: React.FC<OwnProps> = (props) => {
    const location = useLocation()
    const navigate = useNavigate()
    const params = useParams()

    const history = useMemo<RouterHistory>(
      () => ({
        push: (path) =>
          handlePromise(
            typeof path === 'string'
              ? navigate(path)
              : navigate({ pathname: path.pathname, search: path.search })
          ),
        replace: (path) =>
          handlePromise(
            typeof path === 'string'
              ? navigate(path, { replace: true })
              : navigate(
                  { pathname: path.pathname, search: path.search },
                  { replace: true }
                )
          ),
        goBack: () => handlePromise(navigate(-1)),
        listen: listenToRouter,
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
