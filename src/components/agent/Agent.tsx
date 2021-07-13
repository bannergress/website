import React, { FC } from 'react'
import { NamedAgent } from '../../features/mission'
import { createAgentUri } from '../../features/user'

import './agent.less'

export const Agent: FC<AgentProps> = ({ agent }) => {
  return (
    <a href={createAgentUri(agent.name)}>
      <span className={`faction-${agent.faction}`}>{agent.name}</span>
    </a>
  )
}

export interface AgentProps {
  agent: NamedAgent
}
