import React, { FC } from 'react'
import { Switch as AntdSwitch } from 'antd'
import './switch.less'

const Switch: FC<SwitchProps> = ({ checked, onChange }) => (
  <div className={checked ? 'bg-switch bg-switch-selected' : 'bg-switch'}>
    <AntdSwitch checked={checked} onChange={onChange} />
  </div>
)

export interface SwitchProps {
  checked: boolean
  onChange: (checked: boolean) => void
}

export default Switch
