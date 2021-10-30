import React, { FC } from 'react'
import { useSelector } from 'react-redux'
import { useTranslation } from 'react-i18next'

import { Place } from '../../features/place'
import { RootState } from '../../storeTypes'
import PlaceEntry from '../place-list/PlaceEntry'
import { PlaceAccordionEntry } from './PlaceAccordionEntry'
import { ReactComponent as TriangleUpSVG } from '../../img/icons/triangle.svg'
import { ReactComponent as TriangleDownSVG } from '../../img/icons/triangle-down.svg'

import './place-accordion-page.less'

export const PlaceAccordionPage: FC<PlaceAccordionPageProps> = ({
  parentPlace,
  currentPlace,
  hideEmpty,
  expanded,
  onSelectPlace,
  onToggleExpand,
}) => {
  const { t } = useTranslation(undefined, { keyPrefix: 'places' })

  let title
  if (currentPlace) {
    title = (
      <PlaceEntry
        place={currentPlace}
        showNumbers={false}
        attribute="longName"
      />
    )
  } else if (parentPlace) {
    title = t('refine')
  } else {
    title = t('allCountries')
  }

  const children = useSelector((state: RootState) =>
    parentPlace
      ? state.place.administrativeAreas[parentPlace.id] || []
      : state.place.countries || []
  )

  if (hideEmpty && !children.length) {
    return null
  }

  return (
    <div className="place-accordion-page">
      <button
        className="place-accordion-title"
        type="button"
        onClick={onToggleExpand}
      >
        <div>{title}</div>
        {expanded ? <TriangleUpSVG /> : <TriangleDownSVG />}
      </button>
      {expanded && (
        <div className="place-accordion-entries">
          <PlaceAccordionEntry
            key="all"
            place={parentPlace}
            all
            onSelectPlace={onSelectPlace}
            selected={currentPlace?.id === undefined}
          />
          {children.map((childPlace) => (
            <PlaceAccordionEntry
              key={childPlace.id}
              place={childPlace}
              all={false}
              onSelectPlace={onSelectPlace}
              selected={currentPlace?.id === childPlace.id}
            />
          ))}
        </div>
      )}
    </div>
  )
}

export interface PlaceAccordionPageProps {
  parentPlace: Place | undefined
  currentPlace: Place | undefined
  hideEmpty: boolean
  expanded: boolean
  onSelectPlace: (place: Place | undefined) => void
  onToggleExpand: () => void
}
