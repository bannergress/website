import React, { Fragment } from 'react'
// import { useSelector, useDispatch } from 'react-redux'
import { Row, Col, Layout, Space } from 'antd'
// import { actionTypes, selectors } from '../../features/counter'

const Announcement: React.FC = () => {
  // const count = useSelector(selectors.getCountValue)
  // const dispatch = useDispatch()

  return (
    <Fragment>
      <Layout>
        <Space className="px1">
          <Row>
            <Col span="24">
              <h2>Announcement</h2>
              Team will post announcements here to inform agents about what new
              features etc. have been added to the site. This will stay for a
              while given that the site is new.
            </Col>
          </Row>
        </Space>
      </Layout>
    </Fragment>
  )
}

export default Announcement
