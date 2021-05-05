import React from 'react'
import { generatePath } from 'react-router'
import { useHistory, NavLink } from 'react-router-dom'
import { Input } from 'antd'

import LoginInNavbar from '../login/login-in-navbar'
import MenuMain from '../menu-main'
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
    <div className="top-menu">
      <NavLink to="/">
        <div className="brand-logo" style={{ backgroundImage: `url(${Logo})` }}>
          &nbsp;
        </div>
      </NavLink>
      <MenuMain />
      <div>
        <Search
          className="search-bar"
          placeholder="Search Banners or Places"
          onSearch={callSearch}
        />
        <LoginInNavbar />
      </div>
    </div>
  )
}

export default Navbar
