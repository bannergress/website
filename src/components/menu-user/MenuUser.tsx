import { handlePromise } from '../../features/utils/async'
import React from 'react'
import { useNavigate } from 'react-router-dom'
import { Button, Dropdown, MenuProps } from 'antd'
import { useTranslation } from 'react-i18next'

import UserPicture from '../login/user-picture'
import SVGUpArrow from '../../assets/img/icons/up-arrow.svg?react'

import './MenuUser.scss'

const MenuUser: React.FC<MenuUserProps> = ({ logout }) => {
  const navigate = useNavigate()
  const { t } = useTranslation()

  const handleMenuClick = (e: { key: React.Key }) => {
    switch (e.key) {
      case 'logout':
        logout()
        break
      case 'banners':
        handlePromise(navigate('/user/banners/'))
        break
      case 'account':
        handlePromise(navigate('/account'))
        break
      default:
        break
    }
  }
  const menuProps: MenuProps = {
    onClick: handleMenuClick,
    items: [
      {
        label: t('menu.lists'),
        key: 'banners',
      },
      {
        label: t('menu.account'),
        key: 'account',
      },
      {
        type: 'divider',
        key: 'divider',
      },
      {
        label: t('menu.logout'),
        key: 'logout',
      },
    ],
  }

  /* Use both click and hover because of "Profile menu does not always appear #258" */
  return (
    <Dropdown trigger={['click', 'hover']} menu={menuProps}>
      <Button className="menu-user">
        <UserPicture className="user-picture" size={40} />{' '}
        <span className="arrow-icon">
          <SVGUpArrow />
        </span>
      </Button>
    </Dropdown>
  )
}

export interface MenuUserProps {
  logout: () => void
}

export default MenuUser
