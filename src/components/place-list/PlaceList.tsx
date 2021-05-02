import React, { Fragment, FC } from 'react'
import { Row } from 'antd'

import { Place } from '../../features/place'
import PlaceEntry from './PlaceEntry'

import './place-list.less'

const PlaceList: FC<PlaceListProps> = ({
  title,
  selectedPlaces,
  places,
  onSelectPlace,
}) => {
  const onKeyPress = (event: React.KeyboardEvent<Element>, place: Place) => {
    if (event.key === 'U+000D') {
      onSelectPlace(place)
    }
  }

  if (
    (places && places.length > 0) ||
    (selectedPlaces && selectedPlaces.length > 0)
  ) {
    // Sort places by name for listing for now. Might choose later on to sort by
    // number of banners or other criterion
    let sortedPlaces = null
    if (places) {
      sortedPlaces = [...places]
      sortedPlaces.sort((a, b) => a.longName.localeCompare(b.longName))
    }

    return (
      <Fragment>
        {title && <h2>{title}</h2>}
        {selectedPlaces?.map((place) => (
          <h2 key={place.id} className="places-list-item">
            <span
              key={place.id}
              onClick={() => onSelectPlace(place)}
              onKeyPress={(e) => onKeyPress(e, place)}
              role="button"
              tabIndex={0}
            >
              ❮ <PlaceEntry key={place.id} place={place} />
            </span>
          </h2>
        ))}
        {sortedPlaces?.map((place) => (
          <div
            key={place.id}
            className="places-list-item places-list-child"
            onClick={() => onSelectPlace(place)}
            onKeyPress={(e) => onKeyPress(e, place)}
            role="button"
            tabIndex={0}
          >
            <PlaceEntry key={place.id} place={place} />
          </div>
        ))}
      </Fragment>
    )
  }
  return (
    <Fragment>
      <Row>Loading</Row>
    </Fragment>
  )
}

export interface PlaceListProps {
  title?: string
  selectedPlaces?: Array<Place>
  places: Array<Place> | undefined
  onSelectPlace: (place: Place) => void
}

export default PlaceList
