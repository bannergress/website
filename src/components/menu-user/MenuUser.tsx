import React from 'react'
import { useHistory } from 'react-router'
import { Button, Dropdown, Menu } from 'antd'

import { ReactComponent as SVGUpArrow } from '../../img/icons/up-arrow.svg'

import './menu-user.less'
import UserPicture from './UserPicture'

const MenuUser: React.FC<MenuUserProps> = ({ user, logout }) => {
  const history = useHistory()

  const handleMenuClick = (e: { key: React.Key }) => {
    switch (e.key) {
      case 'logout':
        logout()
        break
      case 'banners':
        history.push('/user/banners/')
        break
      default:
        break
    }
  }
  const menu = (
    <Menu onClick={handleMenuClick}>
      <Menu.Item key="banners">My Lists</Menu.Item>
      <Menu.Divider />
      <Menu.Item key="logout">Logout</Menu.Item>
    </Menu>
  )

  /* Use both click and hover because of "Profile menu does not always appear #258" */
  return (
    <Dropdown trigger={['click', 'hover']} overlay={menu}>
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
