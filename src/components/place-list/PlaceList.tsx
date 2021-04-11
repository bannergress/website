import React, { Fragment, FC } from 'react'
import { Row } from 'antd'

import { Place } from '../../features/place'

import './place-list.less'

const PlaceList: FC<PlaceListProps> = ({
  title,
  subtitle,
  places,
  onSelectPlace,
}) => {
  const onKeyPress = (event: React.KeyboardEvent<Element>, place: Place) => {
    if (event.key === 'U+000D') {
      onSelectPlace(place)
    }
  }

  if (places && places.length > 0) {
    return (
      <Fragment>
        <h1>{title}</h1>
        {subtitle && <h3>{subtitle}</h3>}
        <Row justify="space-around" className="place-list" gutter={[16, 16]}>
          {places.map((place) => (
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
        </Row>
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
  title: string
  subtitle?: string
  places: Array<Place> | undefined
  onSelectPlace: (place: Place) => void
}

export default PlaceList
