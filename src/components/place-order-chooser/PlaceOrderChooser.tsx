import { FC } from 'react'
import { useTranslation } from 'react-i18next'
import { PlaceSortOrder } from '../../features/place/types'
import { ChoiceButtons } from '../choice-buttons/ChoiceButtons'

import './PlaceOrderChooser.scss'

interface PlaceOrderChooserProps {
  order: PlaceSortOrder
  onChange: (order: PlaceSortOrder) => void
}

const PlaceOrderChooser: FC<PlaceOrderChooserProps> = ({ order, onChange }) => {
  const { t } = useTranslation()

  return (
    <ChoiceButtons
      className="place-order-chooser"
      label={t('places.sort.label')}
      value={order}
      onChange={onChange}
      options={[
        { value: 'name', label: t('places.sort.name') },
        { value: 'numberOfBanners', label: t('places.sort.numberOfBanners') },
      ]}
    />
  )
}

export default PlaceOrderChooser
