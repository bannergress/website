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
  loadBanner as fetchBannerAction,
  ApiOrder,
  ApiOrderDirection,
  getBanner as getBannerSelector,
} from '../../features/banner'
import { extract } from '../../features/banner/naming'
import SearchMissionList from '../../components/search-mission-list'
import BannerImage from '../../components/banner-image'
import LoadingOverlay from '../../components/loading-overlay'
import { ReactComponent as SVGRightArrow } from '../../img/icons/right_arrow.svg'
import { ReactComponent as SVGCross } from '../../img/icons/cross.svg'

import './create-banner.less'

const MIN_MISSIONS = 2
const MAX_MISSIONS = 3000
const MIN_TITLE_LENGTH = 3
const MAX_TITLE_LENGTH = 200

class CreateBanner extends React.Component<
  CreateBannerProps,
  CreateBannerState
> {
  private timer: NodeJS.Timeout | null = null

  constructor(props: CreateBannerProps) {
    super(props)
    this.state = {
      id: undefined,
      startMissions: [],
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
      detectedLength: 0,
      status: 'initial',
    }
  }

  componentDidMount() {
    const {
      previousBanner,
      match,
      getBanner,
      fetchBanner,
      history,
    } = this.props
    let banner: Banner | undefined
    if (previousBanner) {
      banner = previousBanner
    } else if (match.params.id) {
      banner = getBanner(match.params.id)
      if (!banner) {
        fetchBanner(match.params.id).catch(() => history.push('/'))
      }
    }
    if (banner) {
      this.initialize(banner)
    }
  }

  componentDidUpdate(
    _prevProps: CreateBannerProps,
    prevState: CreateBannerState
  ) {
    const { match, getBanner } = this.props
    const { searchText } = this.state
    if (searchText !== prevState.searchText) {
      this.handleSearch()
    }
    if (match.params.id && prevState.id !== match.params.id) {
      const banner = getBanner(match.params.id)
      if (banner) {
        this.initialize(banner)
      }
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

  initialize = (banner: Banner) => {
    const { title, description, missions, type, width, id } = banner
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
      id,
      startMissions: id ? addedMissions : [],
      bannerTitle: title,
      bannerTitleChanged: id !== undefined,
      bannerDescription: description,
      bannerDescriptionChanged: id !== undefined,
      addedMissions,
      bannerType: type!,
      bannerWidth: width!,
    })
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
    const detectedLength =
      result.results.find((r) => !!r.totalMarker)?.totalMarker?.parsed ?? 0
    const newState: Pick<CreateBannerState, any> = {
      addedMissions,
      detectedLength,
    }
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

  onRemoveAllMissions = () => {
    this.setState({
      addedMissions: [],
      bannerTitle: '',
      bannerDescription: '',
      bannerTitleChanged: false,
      bannerDescriptionChanged: false,
    })
  }

  onManageMission = (mission: Mission) => {
    const { addedMissions } = this.state
    this.setState({ addedMissions: _(addedMissions).without(mission) })
  }

  onCreateBanner = async () => {
    const { createBanner, history } = this.props
    const {
      id,
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
        id,
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
          max={9999}
          min={1}
          onChange={(val) => this.changeMissionNumber(mission, pos, val)}
          onBlur={this.onOrderMissions}
        />
      )
    }
    return undefined
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

  hasGaps = (indexes: Array<number | undefined>) => {
    if (indexes.length > 0) {
      const sorted = _([...indexes]).sortBy()
      if (sorted[0] !== 1 || sorted[sorted.length - 1] !== sorted.length) {
        return true
      }
    }
    return false
  }

  getIssues = () => {
    const {
      addedMissions,
      bannerTitle,
      bannerType,
      bannerWidth,
      detectedLength,
    } = this.state
    const issues: Array<Issue> = []

    const indexes = addedMissions.map((mission) => mission.index)
    const hasDuplicates = _(indexes).uniq(false).length !== addedMissions.length

    if (
      addedMissions.length < MIN_MISSIONS ||
      addedMissions.length > MAX_MISSIONS
    ) {
      issues.push({
        type: 'error',
        field: 'missions',
        message: `A banner must contain between ${MIN_MISSIONS} and ${MAX_MISSIONS} missions.`,
      })
    }
    if (bannerType === 'sequential' && hasDuplicates) {
      issues.push({
        type: 'error',
        field: 'missions',
        message: 'There are 2 or more missions with the same index.',
      })
    }
    if (
      bannerType === 'sequential' &&
      _(addedMissions).any((m) => m.index === undefined || m.index <= 0)
    ) {
      issues.push({
        type: 'error',
        field: 'missions',
        message:
          'There are at least a mission with an invalid index. Indexes must be positive integers.',
      })
    }
    if (
      !bannerTitle ||
      bannerTitle.length < MIN_TITLE_LENGTH ||
      bannerTitle.length > MAX_TITLE_LENGTH
    ) {
      issues.push({
        type: 'error',
        field: 'title',
        message: `The title must be between ${MIN_TITLE_LENGTH} and ${MAX_TITLE_LENGTH} characters`,
      })
    }
    if (this.hasGaps(indexes)) {
      issues.push({
        type: 'warning',
        field: 'missions',
        message: 'The banner could be incomplete, as it has gaps',
      })
    }
    if (bannerType === 'sequential' && indexes.length % bannerWidth !== 0) {
      issues.push({
        type: 'warning',
        field: 'missions',
        message: `The banner could be incomplete, as the number of missions is not divisible by the selected width: ${bannerWidth}`,
      })
    }
    if (detectedLength && detectedLength !== indexes.length) {
      issues.push({
        type: 'warning',
        field: 'missions',
        message: `The banner could be incomplete, as the length difers from the detected length in the title: ${detectedLength}`,
      })
    }

    return issues
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
      status,
      id,
      startMissions,
    } = this.state

    let unusedMissions = _.filter(
      missions,
      (m) => !_.some(addedMissions, (a) => a.id === m.id)
    )
    if (
      status === 'ready' &&
      startMissions.length &&
      searchText &&
      searchText.length > 2
    ) {
      const removed = _.filter(
        startMissions,
        (m) => !_.some(addedMissions, (a) => a.id === m.id)
      )
      unusedMissions = _(unusedMissions)
        .chain()
        .union(
          removed.filter(
            (mission) =>
              mission.title
                .toLocaleLowerCase()
                .includes(searchText.toLocaleLowerCase()) ||
              (mission.author &&
                mission.author.name.toLocaleLowerCase() ===
                  searchText.toLocaleLowerCase())
          )
        )
        .sortBy((mission) => mission.title)
        .value()
    }

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

    const title = id ? 'Edit Banner' : 'New Banner'
    const issues = this.getIssues()

    return (
      <div className="create-banner">
        <Helmet>
          <title>{title}</title>
        </Helmet>
        <Prompt message={this.getPromptMessage} />
        <LoadingOverlay
          active={status === 'loading'}
          text="Generating preview..."
          spinner
          fadeSpeed={500}
        />
        <h1>{title}</h1>
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
              maxLength={200}
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
            <div className="results-title">
              <h3>{addedMissions.length} Missions in Total</h3>
              {addedMissions.length > 0 && (
                <Button
                  role="button"
                  onClick={() => this.onRemoveAllMissions()}
                >
                  Remove All
                </Button>
              )}
            </div>
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
              /* Note: The antd minRows seems to have a -1 bug on Firefox. Shows always one fewer row than specified.
              Works well on other browser https://github.com/ant-design/ant-design/issues/30559  */
              autoSize={{ minRows: 2 }}
              maxLength={2000}
              onChange={(e) =>
                this.onInputChange(e.target.value, 'bannerDescription')
              }
            />
            <h3>Options</h3>
            <div className="adv-options-container open">
              <Row>
                <Col span={12}>
                  <h4>Banner type</h4>
                </Col>
                <Col span={12}>
                  <Select
                    defaultValue={bannerType}
                    onChange={(val) => this.onInputChange(val, 'bannerType')}
                  >
                    <Select.Option value="sequential">Banner</Select.Option>
                    <Select.Option value="anyOrder">
                      Mission collection
                    </Select.Option>
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
              disabled={issues.some((i) => i.type === 'error')}
            >
              Review
            </button>
            <div>
              {issues.map((i) => (
                <p key={i.message}>{i.message}</p>
              ))}
            </div>
          </div>
        </div>
      </div>
    )
  }
}

export interface CreateBannerProps extends RouteComponentProps<{ id: string }> {
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
  getBanner: (id: string) => Banner | undefined
  fetchBanner: (id: string) => Promise<void>
}

interface CreateBannerState {
  id: string | undefined
  startMissions: Array<Mission>
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
  detectedLength: number
  status: 'initial' | 'searching' | 'ready' | 'loading' | 'error'
}

interface Issue {
  field: 'title' | 'description' | 'missions'
  type: 'error' | 'warning'
  message: string
}

const mapStateToProps = (state: RootState) => ({
  previousBanner: getCreatedBanner(state),
  missions: getMissions(state),
  hasMore: getHasMoreSearchedMissions(state),
  getBanner: (id: string) => getBannerSelector(state, id),
})

const mapDispatchToProps = {
  fetchMissions: searchMissionsAction,
  createBanner: createBannerAction,
  resetSearchMissions: resetSearchMissionsAction,
  removePendingBanner: removePendingBannerAction,
  fetchBanner: fetchBannerAction,
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withRouter(CreateBanner))
