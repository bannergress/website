import { Button } from 'antd'
import React, { FC } from 'react'
import { Issue } from './Issue'

import SVGCross from '../../assets/img/icons/cross.svg?react'

const IssueCard: FC<IssueCardProps> = ({ issue, onCloseIssue }) => {
  const onClose = () => {
    if (onCloseIssue) {
      onCloseIssue(issue)
    }
  }

  return (
    <div className={`issue-card issue-${issue.type}`}>
      {issue.message}
      {onCloseIssue && (
        <Button onClick={onClose}>
          <SVGCross />
        </Button>
      )}
    </div>
  )
}

export interface IssueCardProps {
  issue: Issue
  onCloseIssue?: (issue: Issue) => void
}

export default IssueCard
