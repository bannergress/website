import React, { Fragment } from 'react'
import { connect } from 'react-redux'
import { Divider } from 'antd'
import { withRouter, RouteComponentProps } from 'react-router-dom'
import FooterMain from '../../components/footer-main'

class Search extends React.Component<SearchProps> 
{
  constructor(props: SearchProps) {
    super(props)
    this.state = {
    }
  }

  getPageTitle()
  {
    const { match } = this.props;
    const title = `Search Result for ${decodeURIComponent(match.params.term)}`;
    return title;
  }

  render() {
    const title: string = this.getPageTitle();
    document.title = title;
    return (
      <Fragment>
        <div className="mt-1">
          <h2>{title}</h2>
        </div>
        <div className="mt-1">
           { /* TODO Show search results for location if found */ }
        </div>
        <div className="mt-1">
          <Divider type="horizontal" />
        </div>
        <div className="mt-1">
           { /* TODO Show search results for banners if found */ }
        </div>
        <div className="mt-1" />
        <FooterMain />
      </Fragment>
    )
  }
}

export interface SearchProps extends RouteComponentProps<{ term: string }> {
}

export default connect(
)(withRouter(Search))
