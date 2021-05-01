import React from 'react'
import { useHistory, NavLink } from 'react-router-dom'
import { generatePath } from 'react-router'
import { Row, Input, Divider } from 'antd'
import LoginInNavbar from '../login/login-in-navbar'
import MenuMain from '../menu-main/MenuMain'

import Logo from '../../img/logo/logo64.png'

import './Navbar.less'

const { Search } = Input

export const Navbar: React.FC = () => {
  const history = useHistory()
  const callSearch = (value: string) => {
    const trimmedValue = value.trim()

    if (trimmedValue !== '') {
      const path = generatePath('/search/:term', { term: trimmedValue })
      history.push(path)
    }
  }
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
      <MenuMain />
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
