import { FC } from 'react'
import { useTranslation } from 'react-i18next'

import Announcement from '../announcement'
import { useNewsList } from '../../features/news/hooks'

const NewsList: FC = () => {
  const { data } = useNewsList()
  const { t } = useTranslation()

  if (data.length) {
    return (
      <div className="announcements">
        <h1>{t('news.title')}</h1>
        {data.map((newsItem) => (
          <Announcement key={newsItem.uuid} item={newsItem} />
        ))}
      </div>
    )
  }
  return <></>
}

export default NewsList
