import React, { Fragment } from 'react'
import { connect } from 'react-redux'
import { Link, withRouter, RouteComponentProps } from 'react-router-dom'
import { Layout, Row, Col } from 'antd'
import { Helmet } from 'react-helmet'

import { RootState } from '../../storeTypes'
import {
  Banner,
  BannerOrder,
  BannerOrderDirection,
  getBrowsedBanners,
  loadBrowsedBanners as loadBrowsedBannersAction,
  getHasMoreBrowsedBanners,
} from '../../features/banner'
import {
  getCountries,
  getAdministrativeAreas as getAdministrativeAreasSelector,
  loadAdministrativeAreas as loadAdministrativeAreasAction,
  loadCountries as loadCountriesAction,
  Place,
  createMapUri,
} from '../../features/place'

import { ReactComponent as SVGMap } from '../../img/icons/map.svg'

import PlaceList from '../../components/place-list'
import BannerList from '../../components/banner-list'
import BannerOrderChooser from '../../components/banner-order-chooser'

import './browser.less'

class Browser extends React.Component<BrowserProps, BrowserState> {
  constructor(props: BrowserProps) {
    super(props)
    this.state = {
      selectedOrder: 'created',
      selectedDirection: 'DESC',
      selectedPlaces: [],
      page: 0,
      status: 'initial',
    }
  }

  componentDidMount() {
    const {
      fetchCountries,
      fetchAdministrativeAreas,
      fetchBanners,
      match,
    } = this.props
    const { selectedDirection, selectedOrder } = this.state
    const { places } = match.params

    let placesIds: Array<string> = []
    if (places) {
      placesIds = places.split('/')
    }

    const promises: Array<Promise<any>> = []
    promises.push(fetchCountries())
    if (placesIds && placesIds.length > 0) {
      for (let i = 0; i < placesIds.length; i += 1) {
        promises.push(fetchAdministrativeAreas({ id: placesIds[i] }, i + 1))
      }
    }
    Promise.all(promises)
      .then(() => this.setState({ status: 'success' }))
      .catch(() => this.setState({ status: 'error' }))
    fetchBanners(
      { id: placesIds[placesIds.length] },
      selectedOrder,
      selectedDirection,
      0
    )
  }

  static getDerivedStateFromProps(props: BrowserProps, state: BrowserState) {
    const { countries, getAdministrativeAreas, match } = props
    const { selectedPlaces } = state
    const { places } = match.params
    const placesIds = places?.split('/') || []
    const selectedPlacesIds = selectedPlaces.map((s) => s.id)
    if (placesIds.join(',') !== selectedPlacesIds.join(',')) {
      if (placesIds.length === 0) {
        return { ...state, selectedPlaces: [] }
      }
      const country = countries.find((c) => c.id === placesIds[0])
      if (country) {
        const administrativeAreas: Array<Place> = []
        for (let i = 1; i < placesIds.length; i += 1) {
          const areas = getAdministrativeAreas(
            i === 1 ? country : administrativeAreas[i - 2]
          )
          if (!areas) {
            return state
          }
          const area = areas.find((a) => a.id === placesIds[i])
          if (!area) {
            return state
          }
          administrativeAreas.push(area)
        }
        return {
          ...state,
          selectedPlaces: [country, ...administrativeAreas],
        }
      }
    }
    return state
  }

  componentDidUpdate(prevProps: BrowserProps, prevState: BrowserState) {
    const { fetchBanners } = this.props
    const { selectedPlaces, selectedOrder, selectedDirection } = this.state
    if (selectedPlaces !== prevState.selectedPlaces) {
      fetchBanners(
        selectedPlaces[selectedPlaces.length - 1],
        selectedOrder,
        selectedDirection,
        0
      )
    }
  }

  onOrderSelected = (newOrder: BannerOrder) => {
    const { fetchBanners } = this.props
    const { selectedOrder, selectedDirection, selectedPlaces } = this.state
    let newDirection: BannerOrderDirection = 'ASC'
    if (newOrder === selectedOrder) {
      newDirection = selectedDirection === 'ASC' ? 'DESC' : 'ASC'
      this.setState({
        selectedDirection: newDirection,
      })
    } else {
      this.setState({
        selectedOrder: newOrder,
        selectedDirection: newDirection,
      })
    }
    fetchBanners(
      selectedPlaces[selectedPlaces.length - 1],
      newOrder,
      newDirection,
      0
    )
  }

  onPlaceSelected = (place: Place) => {
    const { fetchAdministrativeAreas, history } = this.props
    const { selectedPlaces } = this.state

    let places: Array<Place> = []
    if (selectedPlaces.indexOf(place) < 0) {
      places = [...selectedPlaces, place]
      fetchAdministrativeAreas(place, selectedPlaces.length + 1).then(() =>
        this.setState({
          // selectedPlaces: places,
          page: 1,
        })
      )
    } else {
      places = [...selectedPlaces.slice(0, selectedPlaces.indexOf(place))]
      this.setState({
        // selectedPlaces: places,
        page: 0,
      })
    }
    history.push(`/browse${places.map((p) => `/${p.id}`).join('')}`)
  }

  onLoadMoreBanners = () => {
    const { fetchBanners } = this.props
    const {
      selectedPlaces,
      selectedOrder,
      selectedDirection,
      page,
    } = this.state
    this.setState({ page: page + 1 })
    return fetchBanners(
      selectedPlaces[selectedPlaces.length - 1],
      selectedOrder,
      selectedDirection,
      page + 1
    )
  }

  render() {
    const { countries, banners, getAdministrativeAreas, hasMore } = this.props
    const {
      selectedDirection,
      selectedOrder,
      selectedPlaces,
      status,
    } = this.state

    if (status === 'initial') {
      return <Fragment>Loading content...</Fragment>
    }

    let administrativeAreas: Array<Place> | null = null
    let selectedPlace: Place | null = null
    if (selectedPlaces && selectedPlaces.length) {
      selectedPlace = selectedPlaces[selectedPlaces.length - 1]
      administrativeAreas = getAdministrativeAreas(selectedPlace)
    }

    let pageTitle = 'Countries'
    if (selectedPlace) {
      pageTitle = selectedPlace.formattedAddress
    }

    return (
      <Fragment>
        <Helmet>
          <title>{pageTitle}</title>
        </Helmet>

        <Row>
          <Col span={4} className="places-list">
            <Layout>
              <PlaceList
                title={selectedPlace ? undefined : 'Countries'}
                places={administrativeAreas || countries}
                selectedPlaces={selectedPlaces}
                onSelectPlace={this.onPlaceSelected}
              />
            </Layout>
          </Col>
          <Col span={20}>
            <Row justify="start" className="banner-count">
              <h1>
                {selectedPlace?.numberOfBanners} Banners
                {selectedPlace && (
                  <>
                    &nbsp;in {selectedPlace.longName}
                    <Link to={createMapUri(selectedPlace)}>
                      <SVGMap className="browser-icon" title="Map" />
                    </Link>
                  </>
                )}
              </h1>
            </Row>
            <Row justify="start" className="order-chooser">
              <BannerOrderChooser
                selectedOrder={selectedOrder}
                selectedDirection={selectedDirection}
                onOrderClicked={this.onOrderSelected}
              />
            </Row>
            <Row justify="start" className="banner-list">
              <BannerList
                banners={banners}
                hasMoreBanners={hasMore}
                loadMoreBanners={this.onLoadMoreBanners}
              />
            </Row>
          </Col>
        </Row>
      </Fragment>
    )
  }
}

export interface BrowserProps extends RouteComponentProps<{ places: string }> {
  banners: Array<Banner>
  countries: Array<Place>
  hasMore: Boolean
  getAdministrativeAreas: (place: Place) => Array<Place>
  fetchCountries: () => Promise<void>
  fetchAdministrativeAreas: (
    place: Partial<Place>,
    level: number
  ) => Promise<void>
  fetchBanners: (
    country: Partial<Place> | null,
    order: BannerOrder,
    orderDirection: BannerOrderDirection,
    page: number
  ) => Promise<void>
}

interface BrowserState {
  selectedOrder: BannerOrder
  selectedDirection: BannerOrderDirection
  selectedPlaces: Array<Place>
  page: number
  status: 'initial' | 'success' | 'loading' | 'error'
}

const mapStateToProps = (state: RootState) => ({
  countries: getCountries(state),
  banners: getBrowsedBanners(state),
  getAdministrativeAreas: (place: Place) =>
    getAdministrativeAreasSelector(state, place),
  hasMore: getHasMoreBrowsedBanners(state),
})

const mapDispatchToProps = {
  fetchCountries: loadCountriesAction,
  fetchBanners: loadBrowsedBannersAction,
  fetchAdministrativeAreas: loadAdministrativeAreasAction,
}

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(Browser))
