import React, { FC } from 'react'

import { Place } from '../../features/place'
import PlaceEntry from '../place-list/PlaceEntry'

import './place-accordion-entry.less'

export const PlaceAccordionEntry: FC<PlaceAccordionEntryProps> = ({
  place,
  all,
  selected,
  onSelectPlace,
}) => {
  const extraClassName =
    (selected ? ' place-accordion-entry-selected' : '') +
    (all ? ' place-accordion-entry-all' : '')

  return (
    <button
      type="button"
      onClick={() => onSelectPlace(place)}
      tabIndex={0}
      className={`place-accordion-entry${extraClassName}`}
    >
      {place && !all ? (
        <PlaceEntry place={place} showNumbers attribute="longName" />
      ) : (
        'All'
      )}
    </button>
  )
}

export interface PlaceAccordionEntryProps {
  place: Place | undefined
  all: boolean
  selected: boolean
  onSelectPlace: (place: Place | undefined) => void
}
