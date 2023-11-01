import React, { FC } from 'react'
import { Trans, useTranslation } from 'react-i18next'

import { BannerListType } from '../../features/banner'
import SVGTodo from '../../img/icons/todo.svg?react'
import SVGDone from '../../img/icons/done.svg?react'
import SVGBlacklist from '../../img/icons/blacklist.svg?react'

import './banner-list-type-control.less'

const BannerListTypeControl: FC<BannerListTypeControlProps> = ({
  bannerListType,
  onChangeListType,
}) => {
  const activeClassTodo = bannerListType === 'todo' ? 'active' : ''
  const activeClassDone = bannerListType === 'done' ? 'active' : ''
  const activeClassBlacklist = bannerListType === 'blacklist' ? 'active' : ''
  const { t } = useTranslation()

  const toggle = (clickedListType: BannerListType) => {
    let skip: boolean = false
    if (bannerListType === 'done') {
      skip = !window.confirm(t('banners.confirmNotDone'))
    }
    if (!skip) {
      const newListType =
        bannerListType === clickedListType ? 'none' : clickedListType
      onChangeListType(newListType)
    }
  }

  return (
    <div className="banner-list-type-control">
      <button
        type="button"
        className={`banner-list-type banner-list-type-todo ${activeClassTodo}`}
        onClick={() => toggle('todo')}
      >
        <Trans i18nKey="banners.todo.control">
          <SVGTodo /> TO-DO
        </Trans>
      </button>
      <button
        type="button"
        className={`banner-list-type banner-list-type-done ${activeClassDone}`}
        onClick={() => toggle('done')}
      >
        <Trans i18nKey="banners.done.control">
          <SVGDone /> DONE
        </Trans>
      </button>
      <button
        type="button"
        className={`banner-list-type banner-list-type-blacklist ${activeClassBlacklist}`}
        onClick={() => toggle('blacklist')}
      >
        <Trans i18nKey="banners.hide.control">
          <SVGBlacklist /> HIDE
        </Trans>
      </button>
    </div>
  )
}

export interface BannerListTypeControlProps {
  bannerListType?: BannerListType
  onChangeListType: (bannerListType: BannerListType) => Promise<void>
}

export default BannerListTypeControl
