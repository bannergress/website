import React, { Fragment } from 'react'
import { connect } from 'react-redux'
import { Row, Col, Layout, Space, Divider } from 'antd'
import { withRouter, RouteComponentProps } from 'react-router-dom'
import { Helmet } from 'react-helmet'
import FooterMain from '../../components/footer-main'

class Search extends React.Component<SearchProps> {
  constructor(props: SearchProps) {
    super(props)
    this.state = {}
  }

  getPageTitle() {
    const { match } = this.props
    const title = `Search for ${decodeURIComponent(match.params.term)}`
    return title
  }

  render() {
    const title: string = this.getPageTitle()
    document.title = title
    return (
      <Fragment>
        <Helmet>
          <title>{this.getPageTitle()}</title>
        </Helmet>
        <Layout>
          <Space className="px1">
            <Row>
              <Col span="24">
                <h2>{title}</h2>
              </Col>
            </Row>

            <Row>
              <Col span="24">
                {/* TODO Show search results for location if found */}
              </Col>
            </Row>

            <Row>
              <Col span="24">
                <Divider type="horizontal" />
              </Col>
            </Row>

            <Row>
              <Col span="24">
                {/* TODO Show search results for banners if found */}
              </Col>
            </Row>
          </Space>
        </Layout>

        <FooterMain />
      </Fragment>
    )
  }
}

export interface SearchProps extends RouteComponentProps<{ term: string }> {}

export default connect()(withRouter(Search))
