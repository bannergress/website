import React from 'react'
import { generatePath } from 'react-router'
import { RouteComponentProps, withRouter, NavLink } from 'react-router-dom'
import { Location } from 'history'

import LoginInNavbar from '../login/login-in-navbar'
import SearchInput from '../search-input'
import MenuMain from '../menu-main'
import Logo from '../../img/logo/logo64.png'
import { ReactComponent as SVGSearch } from '../../img/icons/search.svg'

import './Navbar.less'

export class Navbar extends React.Component<RouteComponentProps, NavBarState> {
  constructor(props: RouteComponentProps) {
    super(props)

    this.state = {
      mobileSearchBarActive: false,
    }

    const { history } = this.props
    history.listen(this.locationListen.bind(this))
  }

  locationListen(location: Location) {
    // Hide Mobile search bar when navigating away from search

    if (!location.pathname.startsWith('/search/')) {
      const { mobileSearchBarActive } = this.state
      if (mobileSearchBarActive) {
        this.setState({ mobileSearchBarActive: false })
      }
    }
  }

  toggleMobileSeachBar() {
    const { mobileSearchBarActive } = this.state
    this.setState({ mobileSearchBarActive: !mobileSearchBarActive })
  }

  render() {
    const { history } = this.props

    const callSearch = (value: string) => {
      const trimmedValue = value.trim()

      if (trimmedValue !== '') {
        const path = generatePath('/search/:term', { term: trimmedValue })
        history.push(path)
      }
    }

    const { mobileSearchBarActive } = this.state
    const mobileSearchBarActiveClassName = mobileSearchBarActive ? 'active' : ''

    return (
      <>
        <div className="top-menu">
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
              className={`mobile-search-button-container ${mobileSearchBarActiveClassName}`}
              title="Search"
            >
              <button
                type="button"
                onClick={() => this.toggleMobileSeachBar()}
                className="mobile-search-button"
              >
                <SVGSearch className="search-button-icon" />
              </button>
            </div>
            <div className="search-bar">
              <SearchInput onSearch={callSearch} />
            </div>
            <LoginInNavbar />
          </div>
        </div>
        {mobileSearchBarActive && (
          <div className="mobile-search-bar">
            <SearchInput autoFocus onSearch={callSearch} />
          </div>
        )}
      </>
    )
  }
}

export interface NavBarState {
  mobileSearchBarActive: Boolean
}

export default withRouter(Navbar)
