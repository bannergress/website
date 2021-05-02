import React, { Component, RefObject } from 'react'
import { CSSTransition } from 'react-transition-group'

import Spinner from './Spinner'
// import STYLES from './styles'
import './loading-overlay.less'

class LoadingOverlay extends Component<
  LoadingOverlayProps,
  LoadingOverlayState
> {
  private wrapper: RefObject<HTMLDivElement>

  constructor(props: LoadingOverlayProps) {
    super(props)
    this.wrapper = React.createRef()
  }

  // componentDidMount() {
  //   if (this.wrapper.current) {
  //     const wrapperStyle = window.getComputedStyle(this.wrapper.current)
  //     const overflowCSS = ['overflow', 'overflowX', 'overflowY'].reduce(
  //       (m, i) => {
  //         if (wrapperStyle[i] !== 'visible') m[i] = 'hidden'
  //         return m
  //       },
  //       {}
  //     )
  //     this.setState({ overflowCSS })
  //   }
  // }

  componentDidUpdate() {
    const { active } = this.props
    if (active && this.wrapper.current) this.wrapper.current.scrollTop = 0
  }

  /**
   * Return an emotion css object for a given element key
   * If a custom style was provided via props, run it with
   * the base css obj.
   */
  // getStyles = (key, providedState) => {
  //   const base = STYLES[key](providedState, this.props)
  //   const custom = this.props.styles[key]
  //   if (!custom) return base
  //   return typeof custom === 'function' ? custom(base, this.props) : custom
  // }

  /**
   * Convenience cx wrapper to add prefix classes to each of the child
   * elements for styling purposes.
   */
  // cx = (names, ...args) => {
  //   const arr = Array.isArray(names) ? names : [names]
  //   return cx(
  //     ...arr.map((name) =>
  //       name ? `${this.props.classNamePrefix}${name}` : ''
  //     ),
  //     ...args
  //   )
  // }

  render() {
    const { children, className, active, fadeSpeed, spinner, text } = this.props

    return (
      <div
        data-testid="wrapper"
        ref={this.wrapper}
        className={`loading-overlay ${className} ${active && 'active'}`}
      >
        <CSSTransition
          in={active}
          classNames="_loading-overlay-transition"
          timeout={fadeSpeed}
          unmountOnExit
        >
          <div data-testid="overlay" className="overlay">
            <div className="content">
              {spinner &&
                (typeof spinner === 'boolean' ? <Spinner /> : spinner)}
              {text}
            </div>
          </div>
        </CSSTransition>
        {children}
      </div>
    )
  }
}

export interface LoadingOverlayProps {
  active: boolean
  fadeSpeed: number
  className?: string
  classNamePrefix?: string
  spinner: boolean | React.Component
  text: React.Component | string
  styles?: CSSStyleDeclaration
}

interface LoadingOverlayState {}

// LoadingOverlayWrapper.defaultProps = {
//   classNamePrefix: '_loading_overlay_',
//   fadeSpeed: 500,
//   styles: {},
// }

export default LoadingOverlay
