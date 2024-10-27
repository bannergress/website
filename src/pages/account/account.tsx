import { FC } from 'react'
import { useTranslation } from 'react-i18next'

import UserPicture from '../../components/login/user-picture'
import UserName from '../../components/login/user-name'
import { VerifyAccount } from '../../components/verify-account'

import './account.less'

const Account: FC = () => {
  const { t } = useTranslation()

  return (
    <div className="account page-container">
      <div className="account-page">
        <h1>{t('account.title')}</h1>
        <div className="agent-info">
          <UserPicture size={125} />
          <div className="agent-name-info">
            <span className="user-name">
              <UserName />
            </span>
          </div>
        </div>
        <VerifyAccount />
      </div>
    </div>
  )
}

export default Account
