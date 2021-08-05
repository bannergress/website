import React, { FC } from 'react'
import { generatePath, useHistory } from 'react-router'
import { useDispatch } from 'react-redux'
import { Button } from 'antd'

import { Banner, deleteBanner } from '../../features/banner'

import './banner-edit-tools.less'
import { useUserLoggedIn } from '../../hooks/UserLoggedIn'

export const BannerEditTools: FC<BannerEditToolsProps> = ({ banner }) => {
  const history = useHistory()
  const { authenticated } = useUserLoggedIn('manage-banners')
  const dispatch = useDispatch()

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
    if (window.confirm('Do you really want to delete that banner?')) {
      dispatch(deleteBanner(banner))
      history.push('/')
    }
  }

  if (authenticated) {
    return (
      <div className="banner-edit-tools">
        <Button className="positive-action-button" onClick={onRefreshBanner}>
          Refresh
        </Button>
        <Button className="positive-action-button" onClick={onEditBanner}>
          Edit
        </Button>
        <Button className="negative-action-button" onClick={onDeleteBanner}>
          Delete
        </Button>
      </div>
    )
  }
  return null
}

export interface BannerEditToolsProps {
  banner: Banner
}
