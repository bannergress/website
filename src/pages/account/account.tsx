import React, { useCallback, useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { ThunkDispatch } from 'redux-thunk'
import { useTranslation } from 'react-i18next'
import _ from 'underscore'

import { getCurrentUser, loadCurrentUser } from '../../features/user'
import { UserActionTypes } from '../../features/user/actionTypes'
import { RootState } from '../../storeTypes'
import UserPicture from '../../components/login/user-picture'
import UserName from '../../components/login/user-name'
import { Agent } from '../../components/agent'
import { Issue, IssuesList } from '../../components/Issues-list'
import { VerifyAccount } from '../../components/verify-account'

import './account.less'

type AppDispatch = ThunkDispatch<RootState, any, UserActionTypes>

const Account: React.FC = () => {
  const dispatch: AppDispatch = useDispatch()
  const currentUser = useSelector(getCurrentUser)
  const [issues, setIssues] = useState<Array<Issue>>([])
  const { t } = useTranslation(undefined, { keyPrefix: 'account' })

  useEffect(() => {
    dispatch(loadCurrentUser()).catch((err) =>
      setIssues([
        { key: 'load', message: err.message, type: 'error', field: 'verify' },
      ])
    )
  }, [dispatch, setIssues])

  const onCloseIssue = useCallback(
    (issue: Issue) => {
      setIssues(_(issues).without(issue))
    },
    [issues]
  )

  return (
    <div className="account page-container">
      <div className="account-page">
        <IssuesList issues={issues} onCloseIssue={onCloseIssue} />
        <h1>{t('title')}</h1>
        <div className="agent-info">
          <UserPicture />
          <div className="agent-name-info">
            <span className="user-name">
              <UserName />
            </span>
            {currentUser && currentUser.agent && (
              <span className="agent-name">
                <Agent agent={currentUser.agent} linkToAgentProfile />
              </span>
            )}
          </div>
        </div>
        <VerifyAccount currentUser={currentUser} setIssues={setIssues} />
      </div>
    </div>
  )
}

export default Account
