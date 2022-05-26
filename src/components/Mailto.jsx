import { useTheme } from '@emotion/react'
import React from 'react'

const Mailto = ({ children }) => {
  const { text } = useTheme()
  return (
    <a style={{ color: text.blue }} href={`mailto:${children}`}>
      {children}
    </a>
  )
}

export default Mailto
