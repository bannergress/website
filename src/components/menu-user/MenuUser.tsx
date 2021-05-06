import React from 'react'
import { Button, Dropdown, Menu } from 'antd'

import { ReactComponent as SVGUpArrow } from '../../img/icons/up-arrow.svg'

import './menu-user.less'
import UserPicture from './UserPicture'

const MenuUser: React.FC<MenuUserProps> = ({ user, logout }) => {
  const handleMenuClick = (e: { key: React.Key }) => {
    switch (e.key) {
      case 'logout':
        logout()
        break
      default:
        break
    }
  }
  const menu = (
    <Menu onClick={handleMenuClick}>
      <Menu.Item key="logout">Logout</Menu.Item>
    </Menu>
  )

  return (
    <Dropdown overlay={menu}>
      <Button className="menu-user">
        <UserPicture picture={user.picture} />{' '}
        <span className="arrow-icon">
          <SVGUpArrow />
        </span>
      </Button>
    </Dropdown>
  )
}

export interface User {
  name?: string
  email?: string
  picture?: string
}

export interface MenuUserProps {
  user: User
  logout: () => void
}

export default MenuUser
