import React from 'react'
import { useHistory, NavLink, useLocation } from 'react-router-dom'
import { generatePath } from 'react-router'
import { Menu, Row, Input, Divider } from 'antd'
import LoginInNavbar from '../login/login-in-navbar'

import Logo from '../../img/logo/logo64.png'
import { ReactComponent as SVGHome } from '../../img/icons/home.svg'
import { ReactComponent as SVGBrowse } from '../../img/icons/browse.svg'
import { ReactComponent as SVGMap } from '../../img/icons/map.svg'

import './Navbar.less'
import { useUserLoggedIn } from '../../hooks/UserLoggedIn'

const { Search } = Input

const menuItems = [
  {
    key: '1',
    path: '/',
    title: 'Home',
    icon: <SVGHome className="icon" />,
    isPublic: true,
    regExp: '^/$',
  },
  {
    key: '2',
    path: '/browse',
    title: 'Browse',
    icon: <SVGBrowse className="icon" />,
    isPublic: true,
    regExp: '^/browse',
  },
  {
    key: '3',
    path: '/map',
    title: 'Map',
    icon: <SVGMap className="icon" />,
    isPublic: true,
    regExp: '^/map',
  },
  {
    key: '4',
    path: '/favourites',
    title: 'Favourites',
    icon: <SVGHome className="icon" />,
    isPublic: false,
    regExp: '^/favourites',
  },
]

export const Navbar: React.FC = () => {
  const history = useHistory()
  const location = useLocation()
  const userIsLogged = useUserLoggedIn()
  const callSearch = (value: string) => {
    const trimmedValue = value.trim()

    if (trimmedValue !== '') {
      const path = generatePath('/search/:term', { term: trimmedValue })
      history.push(path)
    }
  }
  const getSelectedKeys = () =>
    menuItems.filter((m) => location.pathname.match(m.regExp)).map((m) => m.key)

  return (
    <Row justify="space-between" align="middle">
      <NavLink to="/">
        <Row justify="start" align="middle">
          <div
            className="brand-logo"
            style={{ backgroundImage: `url(${Logo})` }}
          >
            &nbsp;
          </div>
        </Row>
      </NavLink>
      <Divider type="vertical" />
      <div className="menu-main">
        <Row justify="space-between">
          <Menu theme="dark" mode="horizontal" selectedKeys={getSelectedKeys()}>
            {menuItems.map(
              (item) =>
                (item.isPublic || userIsLogged) && (
                  <Menu.Item key={item.key}>
                    <NavLink to={item.path}>
                      {item.icon}
                      {item.title}
                    </NavLink>
                  </Menu.Item>
                )
            )}
          </Menu>
        </Row>
      </div>
      <Row align="middle">
        <Search
          placeholder="Search Banners or Places"
          onSearch={callSearch}
          style={{ width: 200 }}
        />
      </Row>
      <Row>
        <LoginInNavbar />
      </Row>
    </Row>
  )
}

export default Navbar
