import React, { FC } from 'react'
import { Row } from 'antd'
import { useTranslation } from 'react-i18next'

import { useInfiniteScroll } from '../../hooks/InfiniteScroll'
import { Place } from '../../features/place'
import PlaceCard from './PlaceCard'

import './place-list-flat.less'

const PlaceListFlat: FC<PlaceListFlatProps> = ({
  places,
  hasMorePlaces,
  loadMorePlaces,
}) => {
  const [ref] = useInfiniteScroll({
    callback: loadMorePlaces,
  })

  const { t } = useTranslation()

  if (places && places.length > 0) {
    return (
      <>
        <div className="places-list-flat">
          {places?.map((place) => (
            <div key={place.id} className="places-list-flat-entry">
              <PlaceCard key={place.id} place={place} />
            </div>
          ))}

          {hasMorePlaces && <div ref={ref}>{t('loadingMore')}</div>}
        </div>
      </>
    )
  }
  return <>{hasMorePlaces && <Row>{t('loading')}</Row>}</>
}

export interface PlaceListFlatProps {
  places: Array<Place> | undefined
  hasMorePlaces: Boolean
  loadMorePlaces?: () => Promise<void>
}

export default PlaceListFlat
