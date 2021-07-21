import React from 'react'
import { NavLink } from 'react-router-dom'

import { ReactComponent as SVGHome } from '../../img/icons/home.svg'
import { ReactComponent as SVGBrowse } from '../../img/icons/browse.svg'
import { ReactComponent as SVGMap } from '../../img/icons/map.svg'
import { ReactComponent as SVGHelp } from '../../img/icons/help.svg'
import { ReactComponent as SVGAdd } from '../../img/icons/add.svg'

import './menu-main.less'

const menuItems = [
  {
    key: '1',
    path: '/',
    title: 'Home',
    icon: <SVGHome className="icon" />,
    regExp: '^/$',
  },
  {
    key: '2',
    path: '/browse',
    title: 'Browse',
    icon: <SVGBrowse className="icon" />,
    regExp: '^/browse',
  },
  {
    key: '3',
    path: '/map',
    title: 'Map',
    icon: <SVGMap className="icon" />,
    regExp: '^/map',
  },
  {
    key: '4',
    path: '/help',
    title: 'Help',
    icon: <SVGHelp className="icon" />,
    regExp: '^/help',
  },
  {
    key: '5',
    path: '/new-banner',
    title: 'New',
    icon: <SVGAdd className="icon" />,
    regExp: '^/new-banner|/preview-banner',
  },
]

const MenuMain: React.FC = () => {
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
