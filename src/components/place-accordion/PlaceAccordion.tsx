import React, { FC, useState } from 'react'
import { Place, PlaceSortOrder } from '../../features/place'

import { PlaceAccordionPage } from './PlaceAccordionPage'

import './PlaceAccordion.scss'

export const PlaceAccordion: FC<PlaceAccordionProps> = ({
  selectedPlaces,
  onSelectPlace,
  onExpandPlace,
}) => {
  const hierarchy = [...selectedPlaces!, undefined]

  const [expandedLevel, setExpandedLevel] = useState<number | undefined>(
    undefined
  )

  return (
    <div className="place-accordion">
      {hierarchy.map((place, index) => {
        const parentPlace = hierarchy[index - 1]
        return (
          <PlaceAccordionPage
            key={index} // eslint-disable-line react/no-array-index-key
            expanded={index === expandedLevel}
            currentPlace={place}
            parentPlace={parentPlace}
            hideEmpty={index === hierarchy.length - 1}
            onSelectPlace={(p) => {
              setExpandedLevel(undefined)
              onSelectPlace(p)
            }}
            onToggleExpand={() => {
              if (index === expandedLevel) {
                setExpandedLevel(undefined)
              } else {
                setExpandedLevel(index)
                onExpandPlace(parentPlace)
              }
            }}
          />
        )
      })}
    </div>
  )
}

export interface PlaceAccordionProps {
  selectedPlaces?: Array<Place>
  order: PlaceSortOrder
  onSelectPlace: (place: Place | undefined) => void
  onExpandPlace: (place: Place | undefined) => void
}
