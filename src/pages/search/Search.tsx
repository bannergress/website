import React, { Fragment } from 'react'
import { connect } from 'react-redux'
import { Row, Layout, Divider } from 'antd'
import { withRouter, RouteComponentProps } from 'react-router-dom'
import { Helmet } from 'react-helmet'
import { Trans, withTranslation, WithTranslationProps } from 'react-i18next'

import { RootState } from '../../storeTypes'
import {
  Banner,
  getSearchBanners,
  getHasMoreSearchBanners,
  loadSearchBanners as loadSearchBannersAction,
} from '../../features/banner'
import {
  Place,
  getSearchPlaces,
  getHasMoreSearchPlaces,
  loadSearchPlaces as loadSearchPlacesAction,
} from '../../features/place'
import { decodeURIComponentSafe } from '../../features/utils'
import BannerOrderChooser from '../../components/banner-order-chooser'
import BannerList from '../../components/banner-list'
import PlaceListFlat from '../../components/place-list-flat'
import FooterMain from '../../components/footer-main'

import './Search.scss'
import { BannerFilter } from '../../features/banner/filter'
import { SettingsState } from '../../features/settings/types'
import { getDefaultOnline } from '../../features/settings/selectors'
import { updateSettingsAction } from '../../features/settings/actions'

class Search extends React.Component<SearchProps, SearchState> {
  constructor(props: SearchProps) {
    super(props)
    this.state = {
      filter: {
        orderBy: 'relevance',
        orderDirection: 'DESC',
        online: props.defaultOnline,
      },
      searchTerm: '',
      pageBanners: 0,
      pagePlaces: 0,
      bannersStatus: 'initial',
      placesStatus: 'initial',
    }
  }

  static getDerivedStateFromProps(
    props: Readonly<SearchProps>,
    state: SearchState
  ) {
    const { match } = props
    const { searchTerm } = state
    const newTerm = decodeURIComponentSafe(match.params.term)

    if (searchTerm !== newTerm) {
      return {
        searchTerm: newTerm,
        pageBanners: 0,
        pagePlaces: 0,
      }
    }

    return null
  }

  componentDidMount() {
    const { filter, searchTerm } = this.state

    this.doFetchBanners(searchTerm, filter, 0)
    this.doFetchPlaces(searchTerm, 0)
  }

  componentDidUpdate(prevProps: SearchProps, prevState: SearchState) {
    const { searchTerm: prevSearchTerm } = prevState
    const { searchTerm, filter } = this.state

    if (prevSearchTerm !== searchTerm) {
      this.doFetchBanners(searchTerm, filter, 0)
      this.doFetchPlaces(searchTerm, 0)
    }
  }

  onFilterChanged = (filter: BannerFilter) => {
    const { searchTerm } = this.state
    const { updateSettings } = this.props
    this.setState({
      filter,
      pageBanners: 0,
    })
    updateSettings({
      defaultOnline: filter.online,
    })
    this.doFetchBanners(searchTerm, filter, 0)
  }

  onLoadMoreBanners = () => {
    const { fetchBanners } = this.props
    const { filter, pageBanners, searchTerm } = this.state
    this.setState({ pageBanners: pageBanners + 1 })
    return fetchBanners(searchTerm, filter, pageBanners + 1)
  }

  onLoadMorePlaces = () => {
    const { fetchPlaces } = this.props
    const { pagePlaces, searchTerm } = this.state
    this.setState({ pagePlaces: pagePlaces + 1 })
    return fetchPlaces(searchTerm, pagePlaces + 1)
  }

  getPageTitle() {
    const { i18n } = this.props
    const { searchTerm } = this.state
    return i18n?.t('search.title', { searchTerm }) ?? `Search for ${searchTerm}`
  }

  async doFetchBanners(
    searchTerm: string,
    filter: BannerFilter,
    pageBanners: number
  ) {
    const { fetchBanners } = this.props
    this.setState({ bannersStatus: 'loading' })
    await fetchBanners(searchTerm, filter, pageBanners)
    this.setState({ bannersStatus: 'success' })
  }

  async doFetchPlaces(searchTerm: string, pagePlaces: number) {
    const { fetchPlaces } = this.props
    this.setState({ placesStatus: 'loading' })
    await fetchPlaces(searchTerm, pagePlaces)
    this.setState({ placesStatus: 'success' })
  }

  render() {
    const title: string = this.getPageTitle()
    const { bannersStatus, placesStatus, filter } = this.state
    const { banners, places, hasMoreBanners, hasMorePlaces } = this.props

    return (
      <Fragment>
        <Helmet defer={false}>
          <title>{title}</title>
        </Helmet>
        <div className="search-page page-container">
          <div className="search-content">
            <h1>{title}</h1>

            <h2>
              <Trans i18nKey="places.title">Places</Trans>
            </h2>

            <Layout>
              {placesStatus === 'success' && (
                <>
                  {places.length > 0 && (
                    <>
                      <Row>
                        <PlaceListFlat
                          places={places}
                          hasMorePlaces={hasMorePlaces}
                          loadMorePlaces={this.onLoadMorePlaces}
                        />
                      </Row>
                    </>
                  )}

                  {places.length === 0 && (
                    <>
                      <Row>
                        <Trans i18nKey="places.notFound" count={2}>
                          No places found
                        </Trans>
                      </Row>
                    </>
                  )}
                </>
              )}

              {(placesStatus === 'initial' || placesStatus === 'loading') && (
                <Trans i18nKey="loading">Loading...</Trans>
              )}
            </Layout>

            <Divider type="horizontal" />

            <h2>
              <Trans i18nKey="banners.title">Banners</Trans>
            </h2>

            <Layout>
              <Row justify="start" className="order-chooser">
                <BannerOrderChooser
                  filter={filter}
                  onFilterChanged={this.onFilterChanged}
                  includeRelevance
                  includeOfficial
                />
              </Row>

              {bannersStatus === 'success' && (
                <>
                  {banners.length > 0 && (
                    <>
                      <Row>
                        <BannerList
                          banners={banners}
                          hasMoreBanners={hasMoreBanners}
                          loadMoreBanners={this.onLoadMoreBanners}
                          applyBannerListStyles
                          hideBlacklisted
                          showDetailsButton={false}
                        />
                      </Row>
                    </>
                  )}

                  {banners.length === 0 && (
                    <>
                      <Row>
                        <Trans i18nKey="banners.notFound" count={2}>
                          No banners found
                        </Trans>
                      </Row>
                    </>
                  )}
                </>
              )}

              {(bannersStatus === 'initial' || bannersStatus === 'loading') && (
                <Trans i18nKey="loading">Loading...</Trans>
              )}
            </Layout>
          </div>
          <FooterMain />
        </div>
      </Fragment>
    )
  }
}

export type SearchProps = {
  banners: Array<Banner>
  places: Array<Place>
  hasMoreBanners: Boolean
  hasMorePlaces: Boolean
  fetchBanners: (
    searchTerm: string,
    filter: BannerFilter,
    pageBanners: number
  ) => Promise<void>
  fetchPlaces: (searchTerm: string, pagePlaces: number) => Promise<void>
  defaultOnline: boolean | undefined
  updateSettings: (settings: Partial<SettingsState>) => void
} & RouteComponentProps<{ term: string }> &
  WithTranslationProps

interface SearchState {
  filter: BannerFilter
  searchTerm: string
  pageBanners: number
  pagePlaces: number
  bannersStatus: 'initial' | 'success' | 'loading' | 'error'
  placesStatus: 'initial' | 'success' | 'loading' | 'error'
}

const mapStateToProps = (state: RootState) => ({
  banners: getSearchBanners(state),
  places: getSearchPlaces(state),
  hasMoreBanners: getHasMoreSearchBanners(state),
  hasMorePlaces: getHasMoreSearchPlaces(state),
  defaultOnline: getDefaultOnline(state),
})

const mapDispatchToProps = {
  fetchBanners: loadSearchBannersAction,
  fetchPlaces: loadSearchPlacesAction,
  updateSettings: updateSettingsAction,
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withRouter(withTranslation()(Search)))
