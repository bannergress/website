import { FC } from 'react'
import { useTranslation } from 'react-i18next'
import { ChoiceButton } from '../choice-buttons/ChoiceButton'
import './Switch.scss'

const Switch: FC<SwitchProps> = ({ checked, onChange, labelledBy }) => {
  const { t } = useTranslation()
  return (
    <ChoiceButton
      className="bg-switch"
      role="switch"
      aria-checked={checked}
      aria-labelledby={labelledBy}
      onClick={() => onChange(!checked)}
    >
      {t(checked ? 'buttons.on' : 'buttons.off')}
    </ChoiceButton>
  )
}

export interface SwitchProps {
  checked: boolean
  onChange: (checked: boolean) => void
  labelledBy: string
}

export default Switch
