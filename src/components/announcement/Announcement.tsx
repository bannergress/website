import React, { Fragment } from 'react'
// import { useSelector, useDispatch } from 'react-redux'
import { Row, Col, Layout, Space, Card } from 'antd'
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
              <h1>Announcements</h1>
              <Card style={{ backgroundColor: '#2e2e2e', width: '100%' }}>
                Team will post announcements here to inform agents about what
                new features etc. have been added to the site. This will stay
                for a while given that the site is new.
              </Card>
            </Col>
          </Row>
        </Space>
      </Layout>
    </Fragment>
  )
}

export default Announcement
