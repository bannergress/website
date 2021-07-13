import { generatePath } from 'react-router-dom'

export const createAgentUri = (agentName: string) => {
  return generatePath('/agent/:name', { name: agentName })
}
