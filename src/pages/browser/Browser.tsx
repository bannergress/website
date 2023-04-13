import React, { Fragment } from 'react'
import { connect } from 'react-redux'
import { Link, withRouter, RouteComponentProps } from 'react-router-dom'
import { Helmet } from 'react-helmet'
import { Trans, withTranslation, WithTranslationProps } from 'react-i18next'

import { RootState } from '../../storeTypes'
import {
  Banner,
  getBrowsedBanners,
  loadBrowsedBanners as loadBrowsedBannersAction,
  getHasMoreBrowsedBanners,
} from '../../features/banner'
import {
  getCountries,
  getAdministrativeAreas as getAdministrativeAreasSelector,
  loadAdministrativeAreas as loadAdministrativeAreasAction,
  loadPlace as loadPlaceAction,
  getPlace as getPlaceSelector,
  loadCountries as loadCountriesAction,
  Place,
  createMapUri,
} from '../../features/place'
import PlaceList from '../../components/place-list'
import BannerList from '../../components/banner-list'
import BannerOrderChooser from '../../components/banner-order-chooser'
import FooterMain from '../../components/footer-main'
import { PlaceAccordion } from '../../components/place-accordion/PlaceAccordion'
import { ReactComponent as SVGMap } from '../../img/icons/map.svg'

import './browser.less'
import LoadingOverlay from '../../components/loading-overlay'
import {
  BannerFilter,
  BannerOrder,
  BannerOrderDirection,
} from '../../features/banner/filter'
import {
  getDefaultOnline,
  getDefaultOrder,
} from '../../features/settings/selectors'
import { updateSettingsAction } from '../../features/settings/actions'
import { SettingsState } from '../../features/settings/types'

class Browser extends React.Component<BrowserProps, BrowserState> {
  constructor(props: BrowserProps) {
    super(props)
    this.state = {
      filter: {
        orderBy: props.defaultOrderBy,
        orderDirection: props.defaultOrderDirection,
        online: props.defaultOnline,
      },
      page: 0,
      status: 'initial',
    }
  }

  componentDidMount() {
    const { fetchBanners, fetchPlace, match } = this.props
    const { filter } = this.state
    const { placeId } = match.params

    const promises: Array<Promise<any>> = []

    if (placeId) {
      promises.push(fetchPlace(placeId))
    }
    promises.push(this.fetchChildren(placeId))

    Promise.all(promises)
      .then(() => this.setState({ status: 'success' }))
      .catch(() => this.setState({ status: 'error' }))

    fetchBanners(placeId, filter, 0)
  }

  static getDerivedStateFromProps(props: BrowserProps, state: BrowserState) {
    const { match } = props
    const { placeId } = match.params

    return { ...state, selectedPlaceId: placeId }
  }

  componentDidUpdate(prevProps: BrowserProps) {
    const { fetchBanners, match } = this.props
    const { placeId } = match.params
    const { filter } = this.state
    if (placeId !== prevProps.match.params.placeId) {
      fetchBanners(placeId, filter, 0)
    }
  }

  onFilterChanged = (filter: BannerFilter) => {
    const { fetchBanners, match, updateSettings } = this.props
    const { placeId } = match.params

    this.setState({
      filter,
      page: 0,
    })
    updateSettings({
      defaultOnline: filter.online,
      defaultOrderBy: filter.orderBy,
      defaultOrderDirection: filter.orderDirection,
    })
    fetchBanners(placeId, filter, 0)
  }

  onPlaceSelected = async (place: Place | undefined) => {
    const { history } = this.props

    const newPlaceId = place?.id

    await this.fetchChildren(newPlaceId)

    this.setState({
      selectedPlaceId: newPlaceId,
      page: 0,
      status: 'success',
    })
    history.push(`/browse/${newPlaceId || ''}`)
  }

  // By calling with forceLoad false, we could
  // skip loading lists of places if already loaded
  // during this session
  // We use true for now so that new places are shown when
  // banners were added by yourself or someone else while browsing
  fetchChildren = async (
    placeId: string | undefined,
    forceLoad: boolean = true
  ) => {
    const {
      fetchAdministrativeAreas,
      fetchCountries,
      getAdministrativeAreas,
      countries,
    } = this.props

    if (placeId) {
      if (forceLoad || (getAdministrativeAreas(placeId) ?? []).length === 0) {
        await fetchAdministrativeAreas(placeId)
      }
    } else if (forceLoad || countries.length === 0) {
      await fetchCountries()
    }
  }

  onPlaceExpanded = async (place: Place | undefined) => {
    this.fetchChildren(place?.id)
  }

  onLoadMoreBanners = () => {
    const { fetchBanners, match } = this.props
    const { placeId } = match.params
    const { filter, page } = this.state
    this.setState({ page: page + 1 })
    return fetchBanners(placeId, filter, page + 1)
  }

  render() {
    const {
      countries,
      banners,
      getAdministrativeAreas,
      getPlace,
      hasMore,
      i18n,
    } = this.props
    const { filter, selectedPlaceId, status } = this.state

    if (status === 'initial') {
      return (
        <LoadingOverlay
          spinner
          text={i18n!.t('loading')}
          fadeSpeed={500}
          active
        />
      )
    }

    let administrativeAreas: Array<Place> | null = null
    let selectedPlace: Place | null = null
    let selectedPlaces: Place[] = []

    if (selectedPlaceId) {
      selectedPlace = getPlace(selectedPlaceId)

      if (selectedPlace) {
        administrativeAreas = getAdministrativeAreas(selectedPlaceId) || []
        selectedPlaces = [selectedPlace]

        // Get parent path
        let currentParentPlace: Place | null = selectedPlace
        while (currentParentPlace?.parentPlaceId) {
          currentParentPlace = getPlace(currentParentPlace?.parentPlaceId)

          if (currentParentPlace) {
            selectedPlaces.push(currentParentPlace)
          }
        }
        selectedPlaces.reverse()
      }
    }

    const pageTitle = selectedPlace
      ? selectedPlace.formattedAddress
      : i18n!.t('places.countries')

    return (
      <div className="page-container">
        <div className="browser">
          <Helmet defer={false}>
            <title>{pageTitle}</title>
          </Helmet>

          <PlaceList
            title={selectedPlace ? undefined : i18n!.t('places.countries')}
            order="numberOfBanners"
            places={administrativeAreas || countries}
            selectedPlaces={selectedPlaces}
            onSelectPlace={this.onPlaceSelected}
          />

          <div className="places-content">
            <PlaceAccordion
              selectedPlaces={selectedPlaces}
              order="numberOfBanners"
              onSelectPlace={this.onPlaceSelected}
              onExpandPlace={this.onPlaceExpanded}
            />
            <div className="places-banners">
              {status === 'error' ? (
                <Trans i18nKey="places.notFound">Place not found</Trans>
              ) : (
                <>
                  <h1 className="banner-count">
                    {selectedPlace ? (
                      <Trans
                        i18nKey="places.inCountry"
                        count={selectedPlace.numberOfBanners}
                        values={{ place: selectedPlace.longName }}
                        components={{
                          map: <Link to={createMapUri(selectedPlace)} />,
                          icon: (
                            <SVGMap
                              className="browser-icon"
                              title={i18n!.t('map.title')}
                            />
                          ),
                        }}
                      >
                        {{ count: selectedPlace.numberOfBanners }} Banners in{' '}
                        {{ place: selectedPlace.longName }}{' '}
                        <Link to={createMapUri(selectedPlace)}>
                          <SVGMap
                            className="browser-icon"
                            title={i18n!.t('map.title')}
                          />
                        </Link>
                      </Trans>
                    ) : (
                      <Trans i18nKey="banners.title">Banners</Trans>
                    )}
                  </h1>
                  <BannerOrderChooser
                    filter={filter}
                    onFilterChanged={this.onFilterChanged}
                  />
                  <BannerList
                    banners={banners}
                    hasMoreBanners={hasMore}
                    loadMoreBanners={this.onLoadMoreBanners}
                    applyBannerListStlyes
                    hideBlacklisted
                    showDetailsButton={false}
                  />
                </>
              )}
            </div>
          </div>
        </div>
        <FooterMain />
      </div>
    )
  }
}

export type BrowserProps = {
  defaultOrderBy: BannerOrder
  defaultOrderDirection: BannerOrderDirection
  defaultOnline: boolean | undefined
  banners: Array<Banner>
  countries: Array<Place>
  hasMore: Boolean
  getAdministrativeAreas: (parentPlaceId: string) => Array<Place>
  getPlace: (placeID: string) => Place | null
  fetchCountries: () => Promise<void>
  fetchAdministrativeAreas: (parentPlaceId: string) => Promise<void>
  fetchPlace: (placeID: string) => Promise<void>
  fetchBanners: (
    placeId: string | null,
    filter: BannerFilter,
    page: number
  ) => Promise<void>
  updateSettings: (settings: Partial<SettingsState>) => void
} & RouteComponentProps<{ placeId: string }> &
  WithTranslationProps

interface BrowserState {
  filter: BannerFilter
  selectedPlaceId?: string
  page: number
  status: 'initial' | 'success' | 'loading' | 'error'
}

const mapStateToProps = (state: RootState) => ({
  countries: getCountries(state),
  banners: getBrowsedBanners(state),
  getAdministrativeAreas: (parentPlaceId: string) =>
    getAdministrativeAreasSelector(state, parentPlaceId),
  getPlace: (placeId: string) => getPlaceSelector(state, placeId),
  hasMore: getHasMoreBrowsedBanners(state),
  defaultOnline: getDefaultOnline(state),
  ...getDefaultOrder(state),
})

const mapDispatchToProps = {
  fetchCountries: loadCountriesAction,
  fetchBanners: loadBrowsedBannersAction,
  fetchAdministrativeAreas: loadAdministrativeAreasAction,
  fetchPlace: loadPlaceAction,
  updateSettings: updateSettingsAction,
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withRouter(withTranslation()(Browser)))
