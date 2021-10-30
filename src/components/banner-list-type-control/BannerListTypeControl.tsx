import React, { FC } from 'react'
import { Trans } from 'react-i18next'

import { BannerListType } from '../../features/banner'
import { ReactComponent as SVGTodo } from '../../img/icons/todo.svg'
import { ReactComponent as SVGDone } from '../../img/icons/done.svg'
import { ReactComponent as SVGBlacklist } from '../../img/icons/blacklist.svg'

import './banner-list-type-control.less'

const BannerListTypeControl: FC<BannerListTypeControlProps> = ({
  bannerListType,
  onChangeListType,
}) => {
  const activeClassTodo = bannerListType === 'todo' ? 'active' : ''
  const activeClassDone = bannerListType === 'done' ? 'active' : ''
  const activeClassBlacklist = bannerListType === 'blacklist' ? 'active' : ''

  const toggle = (clickedListType: BannerListType) => {
    const newListType =
      bannerListType === clickedListType ? 'none' : clickedListType
    onChangeListType(newListType)
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
