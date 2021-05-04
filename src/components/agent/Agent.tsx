import React, { FC } from 'react'
import { NamedAgent } from '../../features/mission/types'

import './agent.less'

export const Agent: FC<AgentProps> = ({ agent }) => {
  return <span className={`faction-${agent.faction}`}>{agent.name}</span>
}

export interface AgentProps {
  agent: NamedAgent
}
