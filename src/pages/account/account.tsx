import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { Button, Input } from 'antd'
import { ThunkDispatch } from 'redux-thunk'

import {
  claimUser,
  getCurrentUser,
  loadCurrentUser,
  unlinkUser,
  User,
  verifyUser,
} from '../../features/user'
import { UserActionTypes } from '../../features/user/actionTypes'
import { RootState } from '../../storeTypes'
import { useRefreshToken } from '../../hooks/RefreshToken'
import UserPicture from '../../components/login/user-picture'
import UserName from '../../components/login/user-name'
import { Agent } from '../../components/agent'
import { Issue, IssuesList } from '../../components/Issues-list'

import './account.less'

type AppDispatch = ThunkDispatch<RootState, any, UserActionTypes>

const isAccountLinked = (user: User) => user && user.agent
const isVerifying = (user: User) => !!user.verificationToken
const onCopyToken = (user: User) =>
  navigator.clipboard.writeText(user.verificationToken)

const Account: React.FC = () => {
  const dispatch: AppDispatch = useDispatch()
  const currentUser = useSelector(getCurrentUser)
  const [isClaiming, setIsClaiming] = useState(false)
  const [agent, setAgent] = useState<string>(currentUser?.verificationAgent)
  const [issues, setIssues] = useState<Array<Issue>>([])
  const refreshToken = useRefreshToken()

  useEffect(() => {
    dispatch(loadCurrentUser()).catch((err) =>
      setIssues([
        { key: 'load', message: err.message, type: 'error', field: 'verify' },
      ])
    )
  }, [dispatch])

  useEffect(() => {
    if (currentUser.verificationAgent) {
      setAgent(currentUser.verificationAgent)
    }
  }, [currentUser, setAgent])

  const onClaim = () =>
    dispatch(claimUser(agent)).catch((err) =>
      setIssues([
        { key: 'claim', message: err.message, type: 'error', field: 'verify' },
      ])
    )
  const onVerify = () => {
    dispatch(verifyUser())
      .then(() => refreshToken())
      .catch((err) =>
        setIssues([
          {
            key: 'verify',
            message: err.message,
            type: 'error',
            field: 'verify',
          },
        ])
      )
    setIsClaiming(false)
  }
  const onUnlinkUser = () =>
    dispatch(unlinkUser()).catch((err) =>
      setIssues([
        { key: 'unlink', message: err.message, type: 'error', field: 'verify' },
      ])
    )

  const getClaimButtons = (user: User) => {
    if (isAccountLinked(user)) {
      return (
        <div className="change-verification-buttons">
          <Button
            className="button-default"
            onClick={() => setIsClaiming(true)}
          >
            Change Linked Account
          </Button>
          <Button className="button-default" onClick={onUnlinkUser}>
            Unlink Account
          </Button>
        </div>
      )
    }
    return (
      <div>
        <Button
          className="positive-action-button"
          onClick={() => setIsClaiming(true)}
        >
          Link Ingress Account
        </Button>
      </div>
    )
  }

  return (
    <div className="page-container">
      <div className="account-page">
        <IssuesList issues={issues} />
        <h1>Account</h1>
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
        <div className="account-linking">
          <h3>Ingress account linking</h3>
          {!isAccountLinked(currentUser) && (
            <p>No account linked to your Bannergress profile</p>
          )}
          {isAccountLinked(currentUser) && (
            <p>
              Account linked:{' '}
              <Agent agent={currentUser.agent} linkToAgentProfile={false} />
            </p>
          )}
          {!isClaiming &&
            !isVerifying(currentUser) &&
            getClaimButtons(currentUser)}
          {(isClaiming || isVerifying(currentUser)) && (
            <>
              <h3>Ingress Account Name</h3>
              <div className="input-agent-name">
                <Input
                  value={agent}
                  onChange={(e) => setAgent(e.target.value)}
                />
                <Button className="button-default" onClick={onClaim}>
                  Generate Token
                </Button>
              </div>
            </>
          )}
          {isVerifying(currentUser) && (
            <>
              <h3>Your Token</h3>
              <div className="input-agent-token">
                <Input value={currentUser.verificationToken} disabled />
                <Button
                  className="button-default"
                  onClick={() => onCopyToken(currentUser)}
                >
                  Copy
                </Button>
              </div>

              <h3>Next step</h3>
              <p>Post your token as an activity on Ingress Community Forums</p>
              <div>
                <Link
                  className="forum-link"
                  to="//community.ingress.com/en/activity"
                  target="_blank"
                >
                  Take me there
                </Link>
              </div>
              <p>After posting verify your account linking status</p>
              <div>
                <Button className="positive-action-button" onClick={onVerify}>
                  Verify
                </Button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  )
}

export default Account
