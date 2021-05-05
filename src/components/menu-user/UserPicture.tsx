import React, { FC } from 'react'

const UserPicture: FC<UserPictureProps> = ({ picture }) => {
  return (
    <div
      className="user-picture"
      style={{ backgroundImage: `url('${picture}')` }}
    />
  )
}

export interface UserPictureProps {
  picture?: string
}

export default UserPicture
