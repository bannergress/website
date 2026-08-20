import { FC, useEffect, useState } from 'react'
import { generatePath, useHistory, useLocation } from 'react-router'
import { NavLink } from 'react-router-dom'
import { useTranslation } from 'react-i18next'

import LoginInNavbar from '../login/login-in-navbar'
import SearchInput from '../search-input'
import MenuMain from '../menu-main'
import Logo from '../../assets/img/logo/logo64.png'
import SVGSearch from '../../assets/img/icons/search.svg?react'

import './Navbar.less'

const Navbar: FC<NavBarProps> = ({ className }) => {
  const [mobileSearchBarActive, setMobileSearchBarActive] = useState(false)
  const { t } = useTranslation()
  const history = useHistory()
  const location = useLocation()
  const mobileSearchBarActiveClassName = mobileSearchBarActive ? 'active' : ''
  const insideSearch = location.pathname.startsWith('/search/')
  useEffect(() => {
    if (!insideSearch) {
      setMobileSearchBarActive(false)
    }
  }, [insideSearch])

  const callSearch = (value: string) => {
    const trimmedValue = value.trim()

    if (trimmedValue !== '') {
      const path = generatePath('/search/:term', { term: trimmedValue })
      history.push(path)
    }
  }

  const toggleMobileSeachBar = () => {
    setMobileSearchBarActive(!mobileSearchBarActive)
  }

  return (
    <>
      <div className={`top-menu ${className}`}>
        <NavLink to="/" className="brand-menu">
          <div
            className="brand-logo"
            style={{ backgroundImage: `url(${Logo})` }}
          >
            &nbsp;
          </div>
        </NavLink>
        <MenuMain />
        <div className="right-menu">
          <div
            className={`hide-on-desktop mobile-search-button-container ${mobileSearchBarActiveClassName}`}
            title={t('search.button')}
          >
            <button
              type="button"
              onClick={toggleMobileSeachBar}
              className="mobile-search-button"
            >
              <SVGSearch className="search-button-icon" />
            </button>
          </div>
          <div className="search-bar hide-on-mobile">
            <SearchInput onSearch={callSearch} />
          </div>
          <LoginInNavbar />
        </div>
      </div>
      {mobileSearchBarActive && (
        <div className="mobile-search-bar hide-on-desktop">
          <SearchInput autoFocus onSearch={callSearch} />
        </div>
      )}
    </>
  )
}

export type NavBarProps = {
  className?: string
}

export default Navbar
