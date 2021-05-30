import React, { FC } from 'react'

import { Issue } from './Issue'
import IssueCard from './IssueCard'

import './issues.less'

const IssuesList: FC<IssuesListProps> = ({ issues }) => (
  <div className="issues-list">
    {issues.map((issue) => (
      <IssueCard key={issue.key} issue={issue} />
    ))}
  </div>
)

export interface IssuesListProps {
  issues: Array<Issue>
}

export default IssuesList
