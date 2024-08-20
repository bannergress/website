import React, { FC } from 'react'
import { Link } from 'react-router-dom'
import { NamedAgent } from '../../features/mission'
import { createAgentUri } from '../../features/user'

import './agent.less'

const getInnerSpan = (agent: NamedAgent) => (
  <span className={`faction__${agent.faction}`}>{agent.name}</span>
)

export const Agent: FC<AgentProps> = ({ agent, linkToAgentProfile }) => {
  if (linkToAgentProfile) {
    return <Link to={createAgentUri(agent.name)}>{getInnerSpan(agent)}</Link>
  }
  return getInnerSpan(agent)
}

export interface AgentProps {
  agent: NamedAgent
  linkToAgentProfile: boolean
}
