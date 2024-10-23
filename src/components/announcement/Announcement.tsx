import React from 'react'

import './announcement.less'
import { NewsItem } from '../../features/news/types'

const Announcement: React.FC<AnnouncementProps> = ({ item }) => (
  <div className="announcement-item">{item.content}</div>
)

export interface AnnouncementProps {
  item: NewsItem
}

export default Announcement
