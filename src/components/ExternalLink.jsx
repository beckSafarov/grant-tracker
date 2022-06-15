import { useTheme } from '@emotion/react'
import React from 'react'

const ExternalLink = ({ children, to, label }) => {
  const { text } = useTheme()
  return (
    <a
      target='_blank'
      className='underlineOnHover'
      href={to}
      style={{ color: text.blue }}
    >
      {children || label}
    </a>
  )
}

ExternalLink.defaultProps = {
  href: 'https://google.com',
  label: 'External Link',
}

export default ExternalLink
