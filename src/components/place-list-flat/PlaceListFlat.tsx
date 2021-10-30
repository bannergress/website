import React, { FC } from 'react'
import { Row } from 'antd'
import { Trans } from 'react-i18next'

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

  if (places && places.length > 0) {
    return (
      <>
        <div className="places-list-flat">
          {places?.map((place) => (
            <div key={place.id} className="places-list-flat-entry">
              <PlaceCard key={place.id} place={place} />
            </div>
          ))}

          {hasMorePlaces && (
            <div ref={ref}>
              <Trans i18nKey="loadingMore">Loading more items...</Trans>
            </div>
          )}
        </div>
      </>
    )
  }
  return (
    <>
      {hasMorePlaces && (
        <Row>
          <Trans i18nKey="loading">Loading...</Trans>
        </Row>
      )}
    </>
  )
}

export interface PlaceListFlatProps {
  places: Array<Place> | undefined
  hasMorePlaces: Boolean
  loadMorePlaces?: () => Promise<void>
}

export default PlaceListFlat
