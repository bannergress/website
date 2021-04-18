import React, { Fragment, FC } from 'react'
import { Row } from 'antd'

import { Place } from '../../features/place'

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
    return (
      <Fragment>
        {title && <h1>{title}</h1>}
        {selectedPlaces?.map((place) => (
          <div
            key={place.id}
            onClick={() => onSelectPlace(place)}
            onKeyPress={(e) => onKeyPress(e, place)}
            role="button"
            tabIndex={0}
          >
            &lt; {place.formattedAddress}
          </div>
        ))}
        {places?.map((place) => (
          <div
            key={place.id}
            onClick={() => onSelectPlace(place)}
            onKeyPress={(e) => onKeyPress(e, place)}
            role="button"
            tabIndex={0}
          >
            {place.formattedAddress}
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
