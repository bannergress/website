import React from 'react'
import { connect } from 'react-redux'
import { withRouter, RouteComponentProps, Prompt } from 'react-router-dom'
import { Input, Select, InputNumber, Row, Col, Slider, Button } from 'antd'
import { Helmet } from 'react-helmet'
import _ from 'underscore'
import Scrollbars from 'react-custom-scrollbars'

import { RootState } from '../../storeTypes'
import {
  getHasMoreSearchedMissions,
  getMissions,
  mapMissions,
  Mission,
  searchMissions as searchMissionsAction,
  resetSearchMissions as resetSearchMissionsAction,
} from '../../features/mission'
import {
  Banner,
  BannerType,
  getCreatedBanner,
  NumDictionary,
  createBanner as createBannerAction,
  removePendingBanner as removePendingBannerAction,
  ApiOrder,
  ApiOrderDirection,
} from '../../features/banner'
import { extract } from '../../features/banner/naming'
import SearchMissionList from '../../components/search-mission-list'
import BannerImage from '../../components/banner-image'
import LoadingOverlay from '../../components/loading-overlay'
import { ReactComponent as SVGRightArrow } from '../../img/icons/right_arrow.svg'
import { ReactComponent as SVGCross } from '../../img/icons/cross.svg'

import './create-banner.less'

class CreateBanner extends React.Component<
  CreateBannerProps,
  CreateBannerState
> {
  private timer: NodeJS.Timeout | null = null

  constructor(props: CreateBannerProps) {
    super(props)
    this.state = {
      addedMissions: [],
      page: 0,
      searchText: null,
      location: null,
      bannerTitle: undefined,
      bannerDescription: undefined,
      bannerTitleChanged: false,
      bannerDescriptionChanged: false,
      bannerType: 'sequential',
      bannerWidth: 6,
      showAdvancedOptions: false,
      status: 'initial',
    }
  }

  componentDidMount() {
    const { previousBanner } = this.props
    if (previousBanner) {
      const { title, description, missions, type, width } = previousBanner
      const addedMissions = mapMissions<Mission & { index?: number }>(
        missions,
        (m, index) =>
          m
            ? {
                ...m,
                index: index + 1,
              }
            : undefined
      )
      this.setState({
        bannerTitle: title,
        bannerDescription: description,
        addedMissions,
        bannerType: type!,
        bannerWidth: width!,
      })
    }
  }

  componentDidUpdate(
    _prevProps: CreateBannerProps,
    prevState: CreateBannerState
  ) {
    const { searchText } = this.state
    if (searchText !== prevState.searchText) {
      this.handleSearch()
    }
  }

  componentWillUnmount() {
    const { resetSearchMissions, removePendingBanner } = this.props
    const { status } = this.state
    resetSearchMissions()
    if (status !== 'loading') {
      removePendingBanner()
    }
  }

  handleSearch = () => {
    // Clears running timer and starts a new one each time the user types
    if (this.timer) {
      clearTimeout(this.timer)
    }
    this.timer = setTimeout(() => {
      this.searchMissions()
    }, 1000)
  }

  onSearchForced = () => {
    if (this.timer) {
      clearTimeout(this.timer)
    }
    this.searchMissions()
  }

  searchMissions = async () => {
    const { fetchMissions, resetSearchMissions } = this.props
    const { searchText, location } = this.state
    if (searchText && searchText.length > 2) {
      try {
        this.setState({ page: 0, status: 'searching' })
        await fetchMissions(location, searchText, 'title', 'ASC', 0)
        this.setState({ status: 'ready' })
      } catch {
        this.setState({ status: 'error' })
      }
    } else {
      resetSearchMissions()
    }
  }

  onInputChange = (
    val: string | number,
    inputName:
      | 'searchText'
      | 'location'
      | 'bannerTitle'
      | 'bannerDescription'
      | 'bannerType'
      | 'bannerWidth'
  ) => {
    const newState: Pick<CreateBannerState, any> = { [inputName]: val }
    if (inputName === 'bannerTitle') {
      if (val) {
        newState.bannerTitleChanged = true
      } else {
        newState.bannerTitleChanged = false
      }
    }
    if (inputName === 'bannerDescription') {
      if (val) {
        newState.bannerDescriptionChanged = true
      } else {
        newState.bannerDescriptionChanged = false
      }
    }
    this.setState(newState)
  }

  onLoadMoreMissions = (): Promise<void> => {
    const { fetchMissions } = this.props
    const { location, searchText, page } = this.state
    if (!searchText) {
      throw new Error('no missions to search')
    }
    this.setState({ page: page + 1 })
    return fetchMissions(location, searchText, 'title', 'ASC', page + 1)
  }

  onMissionsChanged = (missions: Array<Mission>) => {
    const { bannerTitleChanged, bannerDescriptionChanged } = this.state
    const result = extract(missions.map((m) => m.title))
    const addedMissions = _(result.results)
      .chain()
      .map((m, index) => ({ ...m, mission: missions[index] }))
      .sortBy((m) => m.missionMarker?.parsed)
      .map((m) => ({ ...m.mission, index: m.missionMarker?.parsed }))
      .value()
    const newState: Pick<CreateBannerState, any> = { addedMissions }
    if (!bannerTitleChanged) {
      newState.bannerTitle = result.title
    }
    if (!bannerDescriptionChanged) {
      newState.bannerDescription = addedMissions[0].description
    }
    this.setState(newState)
  }

  onAddMission = (mission: Mission) => {
    const { addedMissions } = this.state
    this.onMissionsChanged([...addedMissions, mission])
  }

  onAddAllMissions = async (unusedMissions: Array<Mission>) => {
    const { hasMore } = this.props
    const { addedMissions } = this.state
    if (unusedMissions && unusedMissions.length) {
      this.onMissionsChanged([...addedMissions, ...unusedMissions])
      if (hasMore) {
        this.setState({ page: 0, status: 'searching' })
        await this.onLoadMoreMissions()
        this.setState({ status: 'ready' })
      }
    }
  }

  onManageMission = (mission: Mission) => {
    const { addedMissions } = this.state
    this.setState({ addedMissions: _(addedMissions).without(mission) })
  }

  onCreateBanner = async () => {
    const { createBanner, history } = this.props
    const {
      addedMissions,
      bannerTitle,
      bannerDescription,
      bannerType,
      bannerWidth,
    } = this.state
    const missions = addedMissions.reduce<NumDictionary<Mission>>(
      (prev, curr, currentIndex) => {
        const index = bannerType === 'anyOrder' ? currentIndex : curr.index! - 1
        return {
          ...prev,
          [index]: curr,
        }
      },
      {}
    )
    try {
      this.setState({ status: 'loading' })
      await createBanner({
        title: bannerTitle!,
        description: bannerDescription,
        missions,
        numberOfMissions: addedMissions.length,
        width: bannerWidth,
        type: bannerType,
      })
      history.push('/preview-banner')
    } catch {
      this.setState({ status: 'error' })
    }
  }

  getPromptMessage = () => {
    const { status, addedMissions } = this.state
    if (status === 'loading' || addedMissions.length === 0) {
      return true
    }
    return 'Are you sure you want to leave and discard this banner?'
  }

  changeMissionNumber = (
    mission: Mission & { index?: number },
    pos: number,
    index: number
  ) => {
    const { addedMissions } = this.state
    const updatedMissions = [...addedMissions]
    updatedMissions.splice(pos, 1, { ...mission, index })
    this.setState({ addedMissions: updatedMissions })
  }

  onOrderMissions = () => {
    this.setState((state) => ({
      addedMissions: _([...state.addedMissions]).sortBy((a) => a.index),
    }))
  }

  onMissionAuthorClicked = (author: string) => {
    const { searchText } = this.state
    if (
      !searchText ||
      author.localeCompare(searchText, undefined, { sensitivity: 'base' })
    ) {
      this.setState({ searchText: author }, () => this.onSearchForced())
    }
  }

  getMissionIndexEditor = (
    mission: Mission & { index?: number },
    pos: number
  ) => {
    const { bannerType } = this.state
    if (bannerType === 'sequential') {
      return (
        <InputNumber
          value={mission.index}
          max={1000}
          min={1}
          onChange={(val) => this.changeMissionNumber(mission, pos, val)}
          onBlur={this.onOrderMissions}
        />
      )
    }
    return undefined
  }

  toogleAdvancedOptions = () => {
    this.setState((state) => ({
      showAdvancedOptions: !state.showAdvancedOptions,
    }))
  }

  getMissionClass = (mission: Mission & { index?: number }) => {
    const { addedMissions, bannerType } = this.state
    if (
      bannerType === 'sequential' &&
      (!mission.index ||
        mission.index < 0 ||
        addedMissions.some(
          (m) => m.id !== mission.id && m.index === mission.index
        ))
    ) {
      return 'mission-error'
    }
    return ''
  }

  canSubmitBanner = () => {
    const { addedMissions, bannerTitle, bannerType } = this.state
    const indexes = addedMissions.map((mission) => mission.index)
    const hasDuplicates = _(indexes).uniq(false).length !== addedMissions.length

    return (
      addedMissions.length >= 2 &&
      bannerTitle &&
      ((_(addedMissions).all((m) => m.index !== undefined && m.index > 0) &&
        !hasDuplicates) ||
        bannerType === 'anyOrder')
    )
  }

  render() {
    const { missions, hasMore } = this.props
    const {
      addedMissions,
      searchText,
      bannerTitle,
      bannerDescription,
      bannerType,
      bannerWidth,
      showAdvancedOptions,
      status,
    } = this.state

    const unusedMissions = _.filter(
      missions,
      (m) => !_.some(addedMissions, (a) => a.id === m.id)
    )

    let unusedMissionsCount
    if (unusedMissions.length) {
      if (hasMore) {
        unusedMissionsCount = ` (${unusedMissions.length}+)`
      } else {
        unusedMissionsCount = ` (${unusedMissions.length})`
      }
    } else {
      unusedMissionsCount = ''
    }

    return (
      <div className="create-banner">
        <Helmet>Create Banner</Helmet>
        <Prompt message={this.getPromptMessage} />
        <LoadingOverlay
          active={status === 'loading'}
          text="Generating preview..."
          spinner
          fadeSpeed={500}
        />
        <h1>New Banner</h1>
        <div className="create-banner-steps">
          <div className="missions-search">
            <h1>
              <span className="ellipse">1</span> Add Missions
            </h1>
            {/*
            <h3>Location (Optional)</h3>
            <Input
              placeholder="Start typing..."
              onChange={(e) => this.onInputChange(e.target.value, 'location')}
            />
            */}
            <h3>Search for missions</h3>
            <span className="search-mission-subtitle">
              You can search by mission name or author
            </span>
            <Input
              placeholder="Enter at least 3 characters..."
              value={searchText || ''}
              onChange={(e) => this.onInputChange(e.target.value, 'searchText')}
              onKeyPress={(k) =>
                k.key === 'Enter' ? this.onSearchForced() : null
              }
            />
            <div className="results-title">
              <h3>Search results{unusedMissionsCount}</h3>
              {unusedMissions && unusedMissions.length > 0 && (
                <Button
                  role="button"
                  onClick={() => this.onAddAllMissions(unusedMissions)}
                >
                  Add All
                </Button>
              )}
            </div>
            <SearchMissionList
              missions={unusedMissions}
              hasMoreMissions={hasMore}
              icon={<SVGRightArrow />}
              initial={
                status === 'initial' ||
                (status === 'ready' && (!searchText || searchText.length < 3))
              }
              loadMoreMissions={this.onLoadMoreMissions}
              onSelectMission={this.onAddMission}
              onMissionAuthorClick={this.onMissionAuthorClicked}
            />
          </div>
          <div className="missions-arrange">
            <h1>
              <span className="ellipse">2</span> Arrange
            </h1>
            <SearchMissionList
              missions={addedMissions}
              hasMoreMissions={false}
              initial
              icon={<SVGCross />}
              onSelectMission={this.onManageMission}
              onMissionAuthorClick={this.onMissionAuthorClicked}
              missionEditor={this.getMissionIndexEditor}
              missionClass={this.getMissionClass}
            />
          </div>
          <div className="create-banner-info">
            <h1>
              <span className="ellipse">3</span> Information
            </h1>
            <h3>Banner Title</h3>
            <Input
              placeholder="Start typing..."
              value={bannerTitle}
              onChange={(e) =>
                this.onInputChange(e.target.value, 'bannerTitle')
              }
            />
            <h3>Description</h3>
            <Input.TextArea
              placeholder="Start typing..."
              value={bannerDescription}
              onChange={(e) =>
                this.onInputChange(e.target.value, 'bannerDescription')
              }
            />
            <div className="advanced-options">
              <h3>
                Advanced Options{' '}
                <button
                  type="button"
                  onClick={this.toogleAdvancedOptions}
                  className={showAdvancedOptions ? 'open' : 'closed'}
                >
                  ▸
                </button>
              </h3>
              <div
                className={`adv-options-container ${
                  showAdvancedOptions && 'open'
                }`}
              >
                <Row>
                  <Col span={12}>
                    <h4>Banner type</h4>
                  </Col>
                  <Col span={12}>
                    <Select
                      defaultValue={bannerType}
                      onChange={(val) => this.onInputChange(val, 'bannerType')}
                    >
                      <Select.Option value="sequential">
                        Sequential
                      </Select.Option>
                      <Select.Option value="anyOrder">Any order</Select.Option>
                    </Select>
                  </Col>
                  <Col span={12}>
                    <h4>Banner width</h4>
                  </Col>
                  <Col span={12}>
                    <Slider
                      min={1}
                      max={6}
                      onChange={(val: number) =>
                        this.onInputChange(val, 'bannerWidth')
                      }
                      value={bannerWidth}
                    />
                  </Col>
                </Row>
              </div>
            </div>
            <h3>Preview</h3>
            <div className="create-banner-preview">
              <Scrollbars autoHeight autoHeightMin={100} autoHeightMax={284}>
                <BannerImage
                  missions={addedMissions}
                  width={bannerWidth}
                  useIndex={bannerType === 'sequential'}
                />
              </Scrollbars>
            </div>
            <button
              type="button"
              onClick={this.onCreateBanner}
              className="positive-action-button button-review"
              disabled={!this.canSubmitBanner()}
            >
              Review
            </button>
          </div>
        </div>
      </div>
    )
  }
}

export interface CreateBannerProps extends RouteComponentProps {
  previousBanner: Banner | undefined
  missions: Array<Mission>
  hasMore: Boolean
  fetchMissions: (
    location: string | null,
    query: string,
    order: ApiOrder,
    orderDirection: ApiOrderDirection,
    page: number
  ) => Promise<void>
  createBanner: (banner: Partial<Banner>) => Promise<void>
  resetSearchMissions: () => void
  removePendingBanner: () => void
}

interface CreateBannerState {
  addedMissions: Array<Mission & { index?: number }>
  page: number
  searchText: string | null
  location: string | null
  bannerTitle: string | undefined
  bannerDescription: string | undefined
  bannerTitleChanged: boolean
  bannerDescriptionChanged: boolean
  bannerType: BannerType
  bannerWidth: number
  showAdvancedOptions: boolean
  status: 'initial' | 'searching' | 'ready' | 'loading' | 'error'
}

const mapStateToProps = (state: RootState) => ({
  previousBanner: getCreatedBanner(state),
  missions: getMissions(state),
  hasMore: getHasMoreSearchedMissions(state),
})

const mapDispatchToProps = {
  fetchMissions: searchMissionsAction,
  createBanner: createBannerAction,
  resetSearchMissions: resetSearchMissionsAction,
  removePendingBanner: removePendingBannerAction,
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withRouter(CreateBanner))
