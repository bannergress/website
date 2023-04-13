import React from 'react'
import { NavLink } from 'react-router-dom'
import { useTranslation } from 'react-i18next'

import { ReactComponent as SVGHome } from '../../img/icons/home.svg'
import { ReactComponent as SVGBrowse } from '../../img/icons/browse.svg'
import { ReactComponent as SVGMap } from '../../img/icons/map.svg'
import { ReactComponent as SVGHelp } from '../../img/icons/help.svg'
import { ReactComponent as SVGAdd } from '../../img/icons/add.svg'

import './menu-main.less'

const MenuMain: React.FC = () => {
  const { t } = useTranslation(undefined, { keyPrefix: 'menu' })

  const menuItems = [
    {
      key: '1',
      path: '/',
      title: t('home'),
      icon: <SVGHome className="icon" />,
      regExp: '^/$',
    },
    {
      key: '2',
      path: '/browse',
      title: t('browse'),
      icon: <SVGBrowse className="icon" />,
      regExp: '^/browse',
    },
    {
      key: '3',
      path: '/map',
      title: t('map'),
      icon: <SVGMap className="icon" />,
      regExp: '^/map',
    },
    {
      key: '4',
      path: '/help',
      title: t('help'),
      icon: <SVGHelp className="icon" />,
      regExp: '^/help',
    },
    {
      key: '5',
      path: '/new-banner',
      title: t('newBanner'),
      icon: <SVGAdd className="icon" />,
      regExp: '^/new-banner|/preview-banner',
    },
  ]

  return (
    <div className="menu-main">
      {menuItems.map((item) => {
        return (
          <NavLink
            key={item.key}
            to={item.path}
            isActive={(_, location) => !!location.pathname.match(item.regExp)}
          >
            {item.icon}
            {item.title}
          </NavLink>
        )
      })}
    </div>
  )
}

export default MenuMain
