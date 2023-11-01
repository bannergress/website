import React, { Fragment, FC } from 'react'
import { Row } from 'antd'
import { Trans, useTranslation } from 'react-i18next'

import { Place, PlaceSortOrder, sortPlaces } from '../../features/place'
import PlaceEntry from './PlaceEntry'

import './place-list.less'

const PlaceList: FC<PlaceListProps> = ({
  title,
  order,
  selectedPlaces,
  places,
  onSelectPlace,
}) => {
  const { t } = useTranslation()

  const onKeyPress = (event: React.KeyboardEvent<Element>, place: Place) => {
    if (event.key === 'Enter') {
      onSelectPlace(place)
    }
  }

  if (
    (places && places.length > 0) ||
    (selectedPlaces && selectedPlaces.length > 0)
  ) {
    const sortedPlaces = places ? sortPlaces(places, order) : places

    const aligned = Boolean(
      places && places.find((place) => place.type === 'locality')
    )

    return (
      <div className="places-list">
        {title && <h2>{title}</h2>}
        {selectedPlaces?.map((place, index) => (
          <h2 key={place.id} className="places-list-item">
            <span
              key={place.id}
              onClick={() => onSelectPlace(selectedPlaces[index - 1])}
              onKeyPress={(e) => onKeyPress(e, place)}
              role="button"
              tabIndex={0}
            >
              <Trans
                i18nKey="places.backArrow"
                components={{
                  place: (
                    <PlaceEntry
                      key={place.id}
                      place={place}
                      showNumbers={false}
                      attribute="longName"
                    />
                  ),
                }}
              />
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
            <PlaceEntry
              key={place.id}
              place={place}
              showNumbers
              attribute="longName"
              aligned={aligned}
            />
          </div>
        ))}
      </div>
    )
  }
  return (
    <Fragment>
      <Row>{t('loading')}</Row>
    </Fragment>
  )
}

export interface PlaceListProps {
  title?: string
  selectedPlaces?: Array<Place>
  places: Array<Place> | undefined
  order: PlaceSortOrder
  onSelectPlace: (place: Place) => void
}

export default PlaceList
