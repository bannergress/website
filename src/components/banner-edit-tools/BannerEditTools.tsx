import { useKeycloak } from '@react-keycloak/web'
import React, { FC } from 'react'
import { useDispatch } from 'react-redux'
import { useHistory } from 'react-router'
import { Banner } from '../../features/banner'
import { EDIT_BANNER } from '../../features/banner/actionTypes'
import { deleteBanner } from '../../features/banner/api'

import './banner-edit-tools.less'

export const BannerEditTools: FC<BannerEditToolsProps> = ({ banner }) => {
  const history = useHistory()
  const keycloak = useKeycloak()
  const dispatch = useDispatch()

  const onEditBanner = () => {
    dispatch({
      type: EDIT_BANNER,
      payload: banner,
    })
    history.push('/new-banner')
  }

  const onDeleteBanner = async () => {
    // eslint-disable-next-line no-alert
    if (window.confirm('Do you really want to delete that banner?')) {
      await deleteBanner(banner)
      history.push('/')
    }
  }

  if (
    keycloak.initialized &&
    keycloak.keycloak.hasRealmRole('manage-banners')
  ) {
    return (
      <div>
        <button
          type="button"
          className="positive-action-button"
          onClick={onEditBanner}
        >
          Edit
        </button>
        <button
          type="button"
          className="negative-action-button"
          onClick={onDeleteBanner}
        >
          Delete
        </button>
      </div>
    )
  }
  return null
}

export interface BannerEditToolsProps {
  banner: Banner
}
