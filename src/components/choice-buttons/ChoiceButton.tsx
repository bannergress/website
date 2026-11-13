import { ButtonHTMLAttributes } from 'react'

import './ChoiceButtons.scss'

export function ChoiceButton({
  className,
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      {...props}
      type="button"
      className={`choice-button${className ? ` ${className}` : ''}`}
    />
  )
}
