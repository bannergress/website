import React, { Fragment, FC } from 'react'
import { Row } from 'antd'

import { Place } from '../../features/place'

import './place-list.less'
import PlaceEntry from './PlaceEntry'

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
    return (
      <Fragment>
        {title && <h2>{title}</h2>}
        {selectedPlaces?.map((place) => (
          <h2 className="places-list-item">
            <span
              key={place.id}
              onClick={() => onSelectPlace(place)}
              onKeyPress={(e) => onKeyPress(e, place)}
              role="button"
              tabIndex={0}
            >
              ❮ <PlaceEntry place={place} />
            </span>
          </h2>
        ))}
        {places?.map((place) => (
          <div
            className="places-list-item places-list-child"
            key={place.id}
            onClick={() => onSelectPlace(place)}
            onKeyPress={(e) => onKeyPress(e, place)}
            role="button"
            tabIndex={0}
          >
            <PlaceEntry place={place} />
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
