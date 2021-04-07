import React, { Fragment } from 'react'
import { Row, Layout } from 'antd'

const FooterMain: React.FC = () => {
  return (
    <Fragment>
      <Layout className="mt-1">
        <Row justify="center" align="middle" className="footer-main">
          Credits, Other features, and disclaimers.
          <br />
          Social Media links maybe.
          <br /> Support Contact.
        </Row>
      </Layout>
    </Fragment>
  )
}

export default FooterMain
