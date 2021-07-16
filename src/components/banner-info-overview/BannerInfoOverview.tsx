import React, { FC, useEffect, useRef, useState } from 'react'
import { useDispatch } from 'react-redux'
import { Tabs } from 'antd'

import {
  Banner,
  BannerListType,
  changeBannerSettings,
} from '../../features/banner'
import BannerCard from '../banner-card'
import BannerListTypeControl from '../banner-list-type-control'
import MissionList from '../mission-list'
import BannerInfoCard from '../banner-info-card'
import IfUserLoggedIn from '../login/if-user-logged-in'

import './banner-info-overview.less'
import { BannerEditTools } from '../banner-edit-tools/BannerEditTools'

export type BannerInfoView = 'info' | 'missions'

const BannerInfoOverview: FC<BannerInfoOverviewProps> = ({
  banner,
  expanded,
  expandedMissionIndexes,
  scrollMissionIndex,
  hideControls,
  view,
  onChangeView,
  onExpand,
  onExpandAll,
}) => {
  const dispatch = useDispatch()
  const [activeViewFromState, setActiveView] = useState(view)

  const activeView = view || activeViewFromState

  const onTabClick = (key: BannerInfoView) => {
    setActiveView(key)
    if (onChangeView) onChangeView(key)
  }

  const refElement = useRef<HTMLDivElement>(null)

  const areTabsVisible = () => {
    const tabsBar = refElement.current
      ?.getElementsByClassName('ant-tabs-nav')
      ?.item(0) as HTMLElement

    return tabsBar && tabsBar.offsetParent !== null
  }

  const onListTypeChanged = async (listType: BannerListType) => {
    dispatch(changeBannerSettings(banner, { listType }))
  }

  useEffect(() => {
    if (scrollMissionIndex !== undefined && areTabsVisible()) {
      setActiveView('missions')
      if (onChangeView) onChangeView('missions')
    }
  }, [onChangeView, scrollMissionIndex])

  // When showing the missions view, scroll the outer container to the top
  useEffect(() => {
    if (view && view !== 'missions') {
      setTimeout(() => {
        let el: HTMLElement | null = refElement.current

        while (el && el.scrollTop === 0) {
          el = el.parentElement
        }

        el?.scrollTo(0, 0)
      }, 1)
    }
  }, [view])

  const { missions } = banner
  return (
    <div className="banner-info-overview" ref={refElement}>
      {!hideControls && <BannerEditTools banner={banner} />}
      <div className="banner-info-container">
        <BannerCard
          banner={banner}
          selected={false}
          showFullImage
          linkStartPlace
          applyBannerListStlye
        />

        {!hideControls && (
          <IfUserLoggedIn>
            <BannerListTypeControl
              bannerListType={banner.listType}
              onChangeListType={onListTypeChanged}
            />
          </IfUserLoggedIn>
        )}
        <Tabs
          defaultActiveKey="info"
          activeKey={activeView}
          onTabClick={(key) => onTabClick(key as BannerInfoView)}
        >
          <Tabs.TabPane tab="Banner Info" key="info">
            <BannerInfoCard banner={banner} />
          </Tabs.TabPane>
          <Tabs.TabPane tab="Missions" key="missions">
            {missions && (
              <MissionList
                missions={missions}
                expandedMissionIndexes={expandedMissionIndexes}
                expanded={expanded}
                scrollMissionIndex={
                  activeView === 'missions' ? scrollMissionIndex : undefined
                }
                onExpand={onExpand}
                onExpandAll={onExpandAll}
              />
            )}
          </Tabs.TabPane>
        </Tabs>
      </div>
    </div>
  )
}

export interface BannerInfoOverviewProps {
  banner: Banner
  expanded: boolean
  expandedMissionIndexes?: Array<number>
  scrollMissionIndex?: number
  hideControls?: boolean
  view?: BannerInfoView
  onChangeView?: (view: BannerInfoView) => void
  onExpand?: (index: number) => void
  onExpandAll?: () => void
}

export default BannerInfoOverview
