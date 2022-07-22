import React, { ChangeEvent, useRef } from 'react'
import { Temporal } from '@js-temporal/polyfill'
import { Trans } from 'react-i18next'

import { PlainDate } from '../plain-date'

import { ReactComponent as SVGEdit } from '../../img/icons/edit.svg'

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
    <div>
      {useShowPicker ? (
        <div
          onClick={onTriggerPicker}
          onKeyPress={(e) => e.key === 'Enter' && onTriggerPicker()}
          role="button"
          tabIndex={0}
          style={{ cursor: 'pointer' }}
        >
          <input
            type="date"
            ref={inputRef}
            className="date-picker-hidden"
            onChange={onEditComplete}
            value={value || ''}
          />
          {value ? (
            <PlainDate date={Temporal.PlainDate.from(value)} />
          ) : (
            emptyText
          )}{' '}
          <SVGEdit />
        </div>
      ) : (
        <input
          type="date"
          onChange={onEditComplete}
          value={value || ''}
          className="date-picker-visible"
        />
      )}
    </div>
  )
}

export interface DatePickerProps {
  value: string | undefined
  onChange: (value: string | undefined) => void
  emptyText: string
}
