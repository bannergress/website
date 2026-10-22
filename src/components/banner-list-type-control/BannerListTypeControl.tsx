import { handlePromise } from '../../features/utils/async'
import React, { FC, useRef, useState } from 'react'
import { Popover } from 'antd'
import { Trans, useTranslation } from 'react-i18next'

import { BannerListType } from '../../features/banner'
import SVGTodo from '../../assets/img/icons/todo.svg?react'
import SVGDone from '../../assets/img/icons/done.svg?react'
import SVGBlacklist from '../../assets/img/icons/blacklist.svg?react'
import SVGList from '../../assets/img/icons/list.svg?react'

import './BannerListTypeControl.scss'

const BannerListTypeControl: FC<BannerListTypeControlProps> = ({
  bannerListType,
  onChangeListType,
  compact = false,
}) => {
  const { t } = useTranslation()
  const [open, setOpen] = useState(false)
  const [saving, setSaving] = useState(false)
  const [failed, setFailed] = useState(false)
  const savingRef = useRef(false)
  const triggerRef = useRef<HTMLButtonElement>(null)
  const options = [
    { type: 'todo', key: 'todo', icon: <SVGTodo aria-hidden="true" /> },
    { type: 'done', key: 'done', icon: <SVGDone aria-hidden="true" /> },
    {
      type: 'blacklist',
      key: 'hide',
      icon: <SVGBlacklist aria-hidden="true" />,
    },
  ] as const
  const current = options.find((option) => option.type === bannerListType)
  const label = current
    ? `${t('banners.listControls')}: ${t(`banners.${current.key}.name`)}`
    : t('banners.listControls')

  const closeOnEscape = (event: React.KeyboardEvent) => {
    if (compact && event.key === 'Escape') {
      event.stopPropagation()
      setOpen(false)
      triggerRef.current?.focus()
    }
  }

  const toggle = async (clickedListType: BannerListType) => {
    if (savingRef.current) return
    if (
      bannerListType === 'done' &&
      !window.confirm(t('banners.confirmNotDone'))
    ) {
      return
    }
    const newListType =
      bannerListType === clickedListType ? 'none' : clickedListType
    savingRef.current = true
    setSaving(true)
    setFailed(false)
    try {
      await onChangeListType(newListType)
      setOpen(false)
      triggerRef.current?.focus()
    } catch {
      setFailed(true)
    } finally {
      savingRef.current = false
      setSaving(false)
    }
  }

  const controls = (
    <div
      className={`banner-list-type-control${compact ? ' banner-list-type-control-compact' : ''}`}
      role="group"
      aria-label={t('banners.listControls')}
      aria-busy={saving}
      onKeyDown={closeOnEscape}
    >
      {options.map(({ type, key, icon }) => (
        <button
          key={type}
          type="button"
          className={`banner-list-type banner-list-type-${type} ${bannerListType === type ? 'active' : ''}`}
          aria-pressed={bannerListType === type}
          disabled={saving}
          onClick={() => handlePromise(toggle(type))}
        >
          {compact ? (
            <>
              {icon}
              <span>{t(`banners.${key}.name`)}</span>
              {bannerListType === type && (
                <SVGDone
                  className="banner-list-type-check"
                  aria-hidden="true"
                />
              )}
            </>
          ) : (
            <Trans i18nKey={`banners.${key}.control`} components={{ icon }} />
          )}
        </button>
      ))}
      {failed && (
        <div className="banner-list-type-error error-text" role="alert">
          {t('banners.errors.settings')}
        </div>
      )}
    </div>
  )

  if (!compact) return controls

  return (
    <Popover
      content={controls}
      title={t('banners.listControls')}
      trigger="click"
      placement="bottomRight"
      open={open}
      onOpenChange={setOpen}
    >
      <button
        ref={triggerRef}
        type="button"
        className={`banner-list-menu banner-list-menu-${bannerListType ?? 'none'}`}
        aria-label={label}
        title={label}
        aria-expanded={open}
        aria-busy={saving}
        onKeyDown={closeOnEscape}
      >
        {current?.icon ?? <SVGList aria-hidden="true" />}
      </button>
    </Popover>
  )
}

export interface BannerListTypeControlProps {
  bannerListType?: BannerListType
  compact?: boolean
  onChangeListType: (bannerListType: BannerListType) => Promise<void>
}

export default BannerListTypeControl
