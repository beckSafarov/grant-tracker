import { useTheme } from '@emotion/react'
import { Link } from 'react-router-dom'

const MyLink = ({ to, children }) => {
  const { text } = useTheme()

  return (
    <Link style={{ color: text.blue }} to={to}>
      {children}
    </Link>
  )
}

MyLink.defaultProps = {
  to: '/',
}

export default MyLink
