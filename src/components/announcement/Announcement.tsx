import React from 'react'

import './Announcement.scss'
import { NewsItem } from '../../features/news/types'

const Announcement: React.FC<AnnouncementProps> = ({ item }) => (
  <div className="announcement-item">{item.content}</div>
)

export interface AnnouncementProps {
  item: NewsItem
}

export default Announcement
