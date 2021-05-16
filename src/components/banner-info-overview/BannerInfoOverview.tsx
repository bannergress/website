import React, { FC, useEffect, useRef, useState } from 'react'
import { Tabs } from 'antd'

import { Banner } from '../../features/banner'
import BannerCard from '../banner-card'
import MissionList from '../mission-list'
import BannerInfoCard from '../banner-info-card'

import './banner-info-overview.less'
import { BannerEditTools } from '../banner-edit-tools/BannerEditTools'

export type BannerInfoView = 'info' | 'missions'

const BannerInfoOverview: FC<BannerInfoOverviewProps> = ({
  banner,
  expanded,
  expandedMissionIndexes,
  scrollMissionIndex,
  disableShowMissionsOnScroll,
  hideControls,
  view,
  onChangeView,
  onExpand,
  onExpandAll,
}) => {
  const [activeViewFromState, setActiveView] = useState(view)

  const activeView = view || activeViewFromState

  const onTabClick = (key: BannerInfoView) => {
    setActiveView(key)
    if (onChangeView) onChangeView(key)
  }

  const refElement = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!disableShowMissionsOnScroll && scrollMissionIndex !== undefined) {
      setActiveView('missions')
      if (onChangeView) onChangeView('missions')
    }
  }, [disableShowMissionsOnScroll, onChangeView, scrollMissionIndex])

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
        <BannerCard banner={banner} selected={false} showFullImage />
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
  disableShowMissionsOnScroll?: boolean
  hideControls?: boolean
  view?: BannerInfoView
  onChangeView?: (view: BannerInfoView) => void
  onExpand?: (index: number) => void
  onExpandAll?: () => void
}

export default BannerInfoOverview
