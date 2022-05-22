import React, { FC } from 'react'
import { Trans } from 'react-i18next'

import { Place } from '../../features/place'
import PlaceEntry from '../place-list/PlaceEntry'

import './place-accordion-entry.less'
import { ReactComponent as SVGArea } from '../../img/icons/area.svg'

export const PlaceAccordionEntry: FC<PlaceAccordionEntryProps> = ({
  place,
  all,
  selected,
  aligned,
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
        <PlaceEntry
          place={place}
          showNumbers
          attribute="longName"
          aligned={aligned}
        />
      ) : (
        <>
          {aligned && (
            <>
              <SVGArea className="place-icon" />{' '}
            </>
          )}
          <Trans i18nKey="places.all">All</Trans>
        </>
      )}
    </button>
  )
}

export interface PlaceAccordionEntryProps {
  place: Place | undefined
  all: boolean
  selected: boolean
  aligned?: boolean
  onSelectPlace: (place: Place | undefined) => void
}
