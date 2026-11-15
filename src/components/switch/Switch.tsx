import React, { FC } from 'react'
import { Switch as AntdSwitch } from 'antd'
import './Switch.scss'

const Switch: FC<SwitchProps> = ({
  checked,
  onChange,
  'aria-label': ariaLabel,
}) => (
  <div className={checked ? 'bg-switch bg-switch-selected' : 'bg-switch'}>
    <AntdSwitch checked={checked} onChange={onChange} aria-label={ariaLabel} />
  </div>
)

export interface SwitchProps {
  checked: boolean
  onChange: (checked: boolean) => void
  'aria-label'?: string
}

export default Switch
