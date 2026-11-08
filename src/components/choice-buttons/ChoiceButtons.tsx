import { ReactNode } from 'react'
import { ChoiceButton } from './ChoiceButton'

import './ChoiceButtons.scss'

interface ChoiceButtonsProps<T extends string> {
  value: T
  options: readonly { value: T; label: ReactNode }[]
  onChange: (value: T) => void
  label?: string
  labelledBy?: string
  className?: string
}

export function ChoiceButtons<T extends string>({
  value,
  options,
  onChange,
  label,
  labelledBy,
  className,
}: ChoiceButtonsProps<T>) {
  return (
    <div
      className={`choice-buttons${className ? ` ${className}` : ''}`}
      role="group"
      aria-label={label}
      aria-labelledby={labelledBy}
    >
      {options.map((option) => (
        <ChoiceButton
          key={option.value}
          type="button"
          aria-pressed={value === option.value}
          onClick={() => onChange(option.value)}
        >
          {option.label}
        </ChoiceButton>
      ))}
    </div>
  )
}
