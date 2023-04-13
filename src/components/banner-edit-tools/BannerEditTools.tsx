import React, { FC } from 'react'
import { generatePath, useHistory } from 'react-router'
import { useDispatch } from 'react-redux'
import { Button } from 'antd'
import { Trans, useTranslation } from 'react-i18next'

import { Banner, deleteBanner } from '../../features/banner'
import { useUserLoggedIn } from '../../hooks/UserLoggedIn'

import './banner-edit-tools.less'

export const BannerEditTools: FC<BannerEditToolsProps> = ({ banner }) => {
  const history = useHistory()
  const { authenticated } = useUserLoggedIn('manage-banners')
  const { t } = useTranslation()
  const dispatch = useDispatch()
  const owner = banner?.owner === true

  const onEditBanner = () => {
    history.push(generatePath('/edit-banner/:id', { id: banner.id }))
  }
  const onRefreshBanner = () => {
    window.open(
      `https://missions.ingress.com/?bgRefresh=${banner.id}`,
      '_blank'
    )
  }

  const onDeleteBanner = async () => {
    // eslint-disable-next-line no-alert
    if (window.confirm(t('banners.confirmDelete'))) {
      dispatch(deleteBanner(banner))
      history.push('/')
    }
  }

  if (authenticated) {
    return (
      <div className="banner-edit-tools">
        <Button className="positive-action-button" onClick={onRefreshBanner}>
          <Trans i18nKey="buttons.refresh">Refresh</Trans>
        </Button>
        <Button className="positive-action-button" onClick={onEditBanner}>
          <Trans i18nKey="buttons.edit">Edit</Trans>
        </Button>
        <Button className="negative-action-button" onClick={onDeleteBanner}>
          <Trans i18nKey="buttons.delete">Delete</Trans>
        </Button>
      </div>
    )
  }
  if (owner) {
    return (
      <div className="banner-edit-tools">
        <Button className="positive-action-button" onClick={onEditBanner}>
          <Trans i18nKey="buttons.edit">Edit</Trans>
        </Button>
      </div>
    )
  }
  return null
}

export interface BannerEditToolsProps {
  banner: Banner
}
