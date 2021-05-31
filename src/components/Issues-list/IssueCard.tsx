import React, { FC } from 'react'
import { Issue } from './Issue'

const IssueCard: FC<IssueCardProps> = ({ issue }) => (
  <div className={`issue-card issue-${issue.type}`}>{issue.message}</div>
)

export interface IssueCardProps {
  issue: Issue
}

export default IssueCard
