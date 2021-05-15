import React, { FC, useEffect, useState } from 'react'
import { Tabs } from 'antd'

import { Banner } from '../../features/banner'
import BannerCard from '../banner-card'
import MissionList from '../mission-list'
import BannerInfoCard from '../banner-info-card'

import './banner-info-overview.less'
import { BannerEditTools } from '../banner-edit-tools/BannerEditTools'

const BannerInfoOverview: FC<BannerInfoOverviewProps> = ({
  banner,
  expanded,
  expandedMissionIndexes,
  scrollMissionIndex,
  onExpand,
  onExpandAll,
}) => {
  const [activeKey, setActiveKey] = useState('1')

  useEffect(() => {
    if (scrollMissionIndex !== undefined) {
      setActiveKey('2')
    }
  }, [scrollMissionIndex])

  const { missions } = banner
  return (
    <div className="banner-info-overview">
      <BannerEditTools banner={banner} />
      <div className="banner-info-container">
        <BannerCard banner={banner} selected={false} showFullImage />
        <Tabs
          defaultActiveKey="1"
          activeKey={activeKey}
          onTabClick={(key) => setActiveKey(key)}
        >
          <Tabs.TabPane tab="Banner Info" key="1">
            <BannerInfoCard banner={banner} />
          </Tabs.TabPane>
          <Tabs.TabPane tab="Missions" key="2">
            {missions && (
              <MissionList
                missions={missions}
                expandedMissionIndexes={expandedMissionIndexes}
                expanded={expanded}
                scrollMissionIndex={
                  activeKey === '2' ? scrollMissionIndex : undefined
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
  onExpand?: (index: number) => void
  onExpandAll?: () => void
}

export default BannerInfoOverview
