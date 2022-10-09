import React, { FC } from 'react'
import { useTranslation } from 'react-i18next'

export const PlainDate: FC<PlainDateProps> = ({ date }) => {
  const { i18n } = useTranslation()
  const d = new Date(date)
  const formatted = new Intl.DateTimeFormat(i18n.language || 'en', {
    dateStyle: 'medium',
    timeZone: 'UTC',
  }).format(d)
  return <time dateTime={date.toString()}>{formatted}</time>
}

export interface PlainDateProps {
  date: string
}
