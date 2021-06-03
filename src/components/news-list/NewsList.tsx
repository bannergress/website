import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { ThunkDispatch } from 'redux-thunk'

import { getNews, loadNews } from '../../features/news'
import { NewsActionTypes } from '../../features/news/actionTypes'
import { RootState } from '../../storeTypes'
import Announcement from '../announcement'
import { Issue } from '../Issues-list'

import './news-list.less'

type AppDispatch = ThunkDispatch<RootState, any, NewsActionTypes>

const NewsList: React.FC<NewsListProps> = ({ setIssues }) => {
  const dispatch: AppDispatch = useDispatch()
  const news = useSelector(getNews)

  useEffect(() => {
    dispatch(loadNews()).catch(() => {
      setIssues([
        {
          key: 'news-fetch-error',
          type: 'error',
          message: 'Error loading announcements, please try again later',
          field: 'news',
        },
      ])
    })
  }, [dispatch, setIssues])

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

export interface NewsListProps {
  setIssues: (issues: Array<Issue>) => void
}

export default NewsList
