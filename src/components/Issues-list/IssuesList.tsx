import React, { FC } from 'react'

import { Issue } from './Issue'
import IssueCard from './IssueCard'

import './IssuesList.scss'

const IssuesList: FC<IssuesListProps> = ({ issues, onCloseIssue }) => (
  <div className="issues-list">
    {issues.map((issue) => (
      <IssueCard key={issue.key} issue={issue} onCloseIssue={onCloseIssue} />
    ))}
  </div>
)

export interface IssuesListProps {
  issues: Array<Issue>
  onCloseIssue?: (issue: Issue) => void
}

export default IssuesList
