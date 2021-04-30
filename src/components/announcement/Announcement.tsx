import React from 'react'
// import { useSelector, useDispatch } from 'react-redux'
// import { actionTypes, selectors } from '../../features/counter'

import './announcement.less'

const Announcement: React.FC = () => {
  // const count = useSelector(selectors.getCountValue)
  // const dispatch = useDispatch()

  return (
    <div className="announcements">
      <h1>Announcements</h1>
      <div className="announcement-item">
        Team will post announcements here to inform agents about what new
        features etc. have been added to the site. This will stay for a while
        given that the site is new.
      </div>
    </div>
  )
}

export default Announcement
