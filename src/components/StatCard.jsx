import { Paper, Typography } from '@mui/material'

const StatCard = ({ card }) => {
  return (
    <Paper elevation={1} sx={{ padding: '15px', width: '300px' }}>
      <Typography fontSize='1.25rem' color='#1976D2' fontWeight='500'>
        {card.label}
      </Typography>
      <Typography fontWeight='500' fontSize='2rem'>
        {card.data}
      </Typography>
      <Typography fontSize='0.8rem' color='rgb(0, 0, 0, 0.6)'>
        {card.date}
      </Typography>
    </Paper>
  )
}

StatCard.defaultProps = {
  card: { label: '', data: '', date: '' },
}

export default StatCard
