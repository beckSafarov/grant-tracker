import { useTheme } from '@emotion/react'
import React from 'react'
import SVGAvatar from './SVGAvatar'

const Avatar = ({ user, width }) => {
  const { components } = useTheme()
  const { bg, text } = components.avatar
  return <SVGAvatar fullName={user.name} width={70} bg={bg} color={text} />
}

Avatar.defaultProps = {
  user: {},
  width: 50,
}

export default Avatar
