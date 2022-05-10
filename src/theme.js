import { createTheme } from '@mui/material/styles'
import { blue } from '@mui/material/colors'

const theme = createTheme({
  text: {
    blue: blue[700],
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
  },
})

export default theme
