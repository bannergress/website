import React, { Fragment, FC } from 'react'
import { Row } from 'antd'

import { Place } from '../../features/place'
import PlaceCard from './PlaceCard'

import './place-list-flat.less'
import { useInfiniteScroll } from '../../hooks/InfiniteScroll'

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
      <Fragment>
        <div className="places-list-flat">
          {places?.map((place) => (
            <div key={place.id} className="places-list-flat-entry">
              <PlaceCard key={place.id} place={place} />
            </div>
          ))}

          {hasMorePlaces && <div ref={ref}>Loading more items...</div>}
        </div>
      </Fragment>
    )
  }
  return <Fragment>{hasMorePlaces && <Row>Loading...</Row>}</Fragment>
}

export interface PlaceListFlatProps {
  places: Array<Place> | undefined
  hasMorePlaces: Boolean
  loadMorePlaces?: () => Promise<void>
}

export default PlaceListFlat
