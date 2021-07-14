import React, { FC } from 'react'

import { BannerListType } from '../../features/banner'

import './banner-list-type-control.less'

import { ReactComponent as SVGTodo } from '../../img/icons/todo.svg'
import { ReactComponent as SVGDone } from '../../img/icons/done.svg'
import { ReactComponent as SVGBlacklist } from '../../img/icons/blacklist.svg'

const BannerListTypeControl: FC<BannerListTypeControlProps> = ({
  bannerListType,
}) => {
  const activeClassTodo = bannerListType === 'todo' ? 'active' : ''
  const activeClassDone = bannerListType === 'done' ? 'active' : ''
  const activeClassBlacklist = bannerListType === 'blacklist' ? 'active' : ''

  return (
    <div className="banner-list-type-control">
      <button
        type="button"
        className={`banner-list-type banner-list-type-todo ${activeClassTodo}`}
      >
        <SVGTodo /> TO-DO
      </button>
      <button
        type="button"
        className={`banner-list-type banner-list-type-done ${activeClassDone}`}
      >
        <SVGDone /> DONE
      </button>
      <button
        type="button"
        className={`banner-list-type banner-list-type-blacklist ${activeClassBlacklist}`}
      >
        <SVGBlacklist /> HIDE
      </button>
    </div>
  )
}

export interface BannerListTypeControlProps {
  bannerListType?: BannerListType
  // onChangeListType: (bannerListType: BannerListType) => Promise<boolean>
}

export default BannerListTypeControl
