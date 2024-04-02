import { FC } from 'react'
import { generatePath, useHistory } from 'react-router'
import { useDispatch } from 'react-redux'
import { Button } from 'antd'
import { useTranslation } from 'react-i18next'

import { Banner, deleteBanner } from '../../features/banner'
import { useUserLoggedIn } from '../../hooks/UserLoggedIn'
import { useCreatorPluginAvailable } from '../../hooks/CreatorPluginAvailable'

import './banner-edit-tools.less'

export const BannerEditTools: FC<BannerEditToolsProps> = ({ banner }) => {
  const history = useHistory()
  const { authenticated } = useUserLoggedIn('manage-banners')
  const { t } = useTranslation()
  const dispatch = useDispatch()
  const creatorPluginAvailable = useCreatorPluginAvailable()
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

  const buttons = []
  if (creatorPluginAvailable) {
    buttons.push(
      <Button
        key="refresh"
        className="positive-action-button"
        onClick={onRefreshBanner}
      >
        {t('buttons.refresh')}
      </Button>
    )
  }
  if (owner || authenticated) {
    buttons.push(
      <Button
        key="edit"
        className="positive-action-button"
        onClick={onEditBanner}
      >
        {t('buttons.edit')}
      </Button>
    )
  }
  if (authenticated) {
    buttons.push(
      <Button
        key="delete"
        className="negative-action-button"
        onClick={onDeleteBanner}
      >
        {t('buttons.delete')}
      </Button>
    )
  }

  return buttons.length ? (
    <div className="banner-edit-tools">{buttons}</div>
  ) : null
}

export interface BannerEditToolsProps {
  banner: Banner
}
