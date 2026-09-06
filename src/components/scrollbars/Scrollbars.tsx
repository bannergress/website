import { ComponentPropsWithRef } from 'react'

import './Scrollbars.scss'

interface ScrollbarsProps extends ComponentPropsWithRef<'div'> {
  autoHeight?: boolean
  autoHeightMin?: number
  autoHeightMax?: number
}

export const Scrollbars = ({
  autoHeight = false,
  autoHeightMin,
  autoHeightMax,
  className = '',
  style,
  ...props
}: ScrollbarsProps) => (
  <div
    {...props}
    className={`scrollbars ${className}`}
    style={{
      height: autoHeight ? 'auto' : undefined,
      minHeight: autoHeight ? autoHeightMin : undefined,
      maxHeight: autoHeight ? autoHeightMax : undefined,
      ...style,
    }}
  />
)
