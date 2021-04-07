import React, { Fragment } from 'react'
import { useParams } from 'react-router-dom'

export const BannerDetails: React.FC = () => {
  const { id } = useParams<BannerParams>()
  return (
    <Fragment>
      <h1>Banner {id}</h1>
    </Fragment>
  )
}

export interface BannerParams {
  id: string
}
