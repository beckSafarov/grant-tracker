import { createTheme } from '@mui/material/styles'
import { blue, green } from '@mui/material/colors'

const theme = createTheme({
  text: {
    blue: blue[700],
    grey: '#9e9e9e',
  },
  page: {
    grey: '#F7F9FC',
  },
  components: {
    sidebar: {
      base: '#233044',
      bg: '#233044',
      text: '#eee',
      lighten: '#344865',
      darken: '#233050',
      activeTest: '#00cc66',
      active: {
        text: '#00cc66',
        div: '#344865',
      },
    },
    avatar: {
      bg: '#00AFB9',
      text: '#fff',
    },
    button: {
      green: green[600],
    },
  },
})

export default theme
