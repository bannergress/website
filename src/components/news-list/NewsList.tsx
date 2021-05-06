import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'

import { getNews, loadNews } from '../../features/news'
import Announcement from '../announcement'

import './news-list.less'

const NewsList: React.FC = () => {
  const dispatch = useDispatch()
  const news = useSelector(getNews)

  useEffect(() => {
    dispatch(loadNews())
  }, [dispatch])

  if (news && news.length) {
    return (
      <div className="announcements">
        <h1>Announcements</h1>
        {news.map((newsItem) => (
          <Announcement key={newsItem.uuid} item={newsItem} />
        ))}
      </div>
    )
  }
  return <></>
}

export default NewsList
