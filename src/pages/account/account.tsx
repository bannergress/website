import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { Button, Input } from 'antd'
import { ThunkDispatch } from 'redux-thunk'
import { useTranslation } from 'react-i18next'

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
  const { t, i18n } = useTranslation(undefined, { keyPrefix: 'account' })

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
            {t('linking.change')}
          </Button>
          <Button className="button-default" onClick={onUnlinkUser}>
            {t('linking.unlink')}
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
          {t('linking.link')}
        </Button>
      </div>
    )
  }

  return (
    <div className="page-container">
      <div className="account-page">
        <IssuesList issues={issues} />
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
        <div className="account-linking">
          <h3>{t('linking.title')}</h3>
          {!isAccountLinked(currentUser) && <p>{t('none')}</p>}
          {isAccountLinked(currentUser) && (
            <p>
              {t('linking.linked')}
              <Agent agent={currentUser.agent} linkToAgentProfile={false} />
            </p>
          )}
          {!isClaiming &&
            !isVerifying(currentUser) &&
            getClaimButtons(currentUser)}
          {(isClaiming || isVerifying(currentUser)) && (
            <>
              <h3>{t('linking.step1.title')}</h3>
              <div className="input-agent-name">
                <Input
                  value={agent}
                  onChange={(e) => setAgent(e.target.value)}
                />
                <Button className="button-default" onClick={onClaim}>
                  {t('linking.step1.action')}
                </Button>
              </div>
            </>
          )}
          {isVerifying(currentUser) && (
            <>
              <h3>{t('linking.token')}</h3>
              <div className="input-agent-token">
                <Input value={currentUser.verificationToken} disabled />
                <Button
                  className="button-default"
                  onClick={() => onCopyToken(currentUser)}
                >
                  {i18n.t('buttons.copy')}
                </Button>
              </div>

              <h3>{t('linking.step2.title')}</h3>
              <p>{t('linking.step2.description')}</p>
              <div>
                <Link
                  className="forum-link"
                  to={t<string>('linkin.step2.link')}
                  target="_blank"
                >
                  {t('linking.step2.action')}
                </Link>
              </div>
              <p>{t('linking.step3.title')}</p>
              <div>
                <Button className="positive-action-button" onClick={onVerify}>
                  {t('linking.step3.action')}
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
