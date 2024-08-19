import React, { ChangeEvent, useRef } from 'react'

import { PlainDate } from '../plain-date'

import SVGEdit from '../../img/icons/edit.svg?react'

import './date-picker.less'

export const DatePicker: React.FC<DatePickerProps> = ({
  value,
  onChange,
  emptyText,
}) => {
  const inputRef = useRef<HTMLInputElement>(null)

  const useShowPicker = 'showPicker' in HTMLInputElement.prototype

  const onTriggerPicker = () => {
    const input: any = inputRef.current!
    input.showPicker()
  }

  const onEditComplete = (event: ChangeEvent<HTMLInputElement>) => {
    onChange(event.target.value || undefined)
  }

  return (
    <div className='date-picker'>
      {useShowPicker ? (
        <div onClick={onTriggerPicker} onKeyPress={(e) => e.key === 'Enter' && onTriggerPicker()} role="button" tabIndex={0}  >
          <input type="date" ref={inputRef} className="date-picker--hidden" onChange={onEditComplete} value={value || ''} aria-label='hidden-date-picker' />
          {value ? <PlainDate date={value} /> : emptyText} <SVGEdit />
        </div>
      ) : (
        <input type="date" onChange={onEditComplete} value={value || ''} className="date-picker--visible" aria-label='visible-date-picker' />
      )}
    </div>
  )
}

export interface DatePickerProps {
  value: string | undefined
  onChange: (value: string | undefined) => void
  emptyText: string
}
