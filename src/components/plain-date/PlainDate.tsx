import React, { FC } from 'react'
import { useTranslation } from 'react-i18next'
import { Temporal } from '@js-temporal/polyfill'

export const PlainDate: FC<PlainDateProps> = ({ date }) => {
  const { i18n } = useTranslation()
  const d = new Date(date.toString())
  const formatted = new Intl.DateTimeFormat(i18n.language || 'en', {
    dateStyle: 'medium',
  }).format(d)
  return <time dateTime={date.toString()}>{formatted}</time>
}

export interface PlainDateProps {
  date: Temporal.PlainDate | string
}
