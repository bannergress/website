/* eslint-disable i18next/no-literal-string */
import { FC, useEffect, useRef } from 'react'
import { CSSTransition } from 'react-transition-group'

import Spinner from './Spinner'
import './loading-overlay.less'

export const LoadingOverlay: FC<LoadingOverlayProps> = ({ active, text }) => {
  const ref = useRef<HTMLDivElement>(null)
  useEffect(() => {
    if (active && ref.current) ref.current.scrollTop = 0
  }, [active, ref])
  return (
    <div
      data-testid="wrapper"
      ref={ref}
      className={`loading-overlay ${active && 'active'}`}
    >
      <CSSTransition
        in={active}
        classNames="_loading-overlay-transition"
        timeout={500}
        unmountOnExit
      >
        <div data-testid="overlay" className="overlay">
          <div className="content">
            <>
              <Spinner />
              {text}
            </>
          </div>
        </div>
      </CSSTransition>
    </div>
  )
}

export interface LoadingOverlayProps {
  active: boolean
  text: string
}

export default LoadingOverlay
