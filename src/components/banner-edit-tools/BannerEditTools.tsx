import { handlePromise, handleAsync } from '../../features/utils/async'
import { FC } from 'react'
import { generatePath, useNavigate } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import type { AppDispatch } from '../../store'
import { Button } from 'antd'
import { useTranslation } from 'react-i18next'

import { Banner, deleteBanner } from '../../features/banner'
import { useUserLoggedIn } from '../../hooks/UserLoggedIn'
import { useCreatorPluginAvailable } from '../../hooks/CreatorPluginAvailable'

import './BannerEditTools.scss'

export const BannerEditTools: FC<BannerEditToolsProps> = ({ banner }) => {
  const navigate = useNavigate()
  const { authenticated } = useUserLoggedIn('manage-banners')
  const { t } = useTranslation()
  const dispatch = useDispatch<AppDispatch>()
  const creatorPluginAvailable = useCreatorPluginAvailable()
  const owner = banner?.owner === true

  const onEditBanner = () => {
    handlePromise(navigate(generatePath('/edit-banner/:id', { id: banner.id })))
  }
  const onRefreshBanner = () => {
    window.open(
      `https://missions.ingress.com/?bgRefresh=${banner.id}`,
      '_blank'
    )
  }

  const onDeleteBanner = async () => {
    if (window.confirm(t('banners.confirmDelete'))) {
      await dispatch(deleteBanner(banner))
      handlePromise(navigate('/'))
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
        onClick={handleAsync(onDeleteBanner)}
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
