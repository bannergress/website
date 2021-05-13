import React, { FC } from 'react'
import { Tabs } from 'antd'

import { Banner } from '../../features/banner'
import BannerCard from '../banner-card'
import MissionList from '../mission-list'
import BannerInfoCard from '../banner-info-card'

import './banner-info-overview.less'

const BannerInfoOverview: FC<BannerInfoOverviewProps> = ({
  banner,
  expanded,
  expandedMissionIndexes,
  onExpand,
  onExpandAll,
}) => {
  const { missions } = banner
  return (
    <div className="banner-info-overview">
      <div className="banner-info-container">
        <BannerCard banner={banner} selected={false} showFullImage />
        <Tabs defaultActiveKey="1">
          <Tabs.TabPane tab="Banner Info" key="1">
            <BannerInfoCard banner={banner} />
          </Tabs.TabPane>
          <Tabs.TabPane tab="Missions" key="2">
            {missions && (
              <MissionList
                missions={missions}
                expandedMissionIndexes={expandedMissionIndexes}
                expanded={expanded}
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
  onExpand?: (index: number) => void
  onExpandAll?: () => void
}

export default BannerInfoOverview
