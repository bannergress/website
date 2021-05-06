import React from 'react'
import { NewsItem } from '../../features/news'

import './announcement.less'

const Announcement: React.FC<AnnouncementProps> = ({ item }) => (
  <div className="announcement-item">{item.content}</div>
)

export interface AnnouncementProps {
  item: NewsItem
}

export default Announcement
