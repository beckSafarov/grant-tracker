import { Paper, Typography, useTheme } from '@mui/material'

const StatCard = ({ card, width }) => {
  const theme = useTheme()
  const texts = [
    {
      fontSize: '1rem',
      color: theme.text.blue,
      fontWeight: '500',
      body: card.label,
    },
    {
      fontSize: '2rem',
      fontWeight: '500',
      body: card.data,
    },
    {
      fontSize: '0.8rem',
      fontWeight: '500',
      color: 'rgb(0, 0, 0, 0.6)',
      body: card.date,
    },
  ]

  return (
    <Paper elevation={1} sx={{ padding: '15px', width }}>
      {texts.map((text, i) => (
        <Typography
          key={i}
          fontSize={text.fontSize}
          color={text.color}
          fontWeight={text.fontWeight}
        >
          {text.body}
        </Typography>
      ))}
    </Paper>
  )
}

StatCard.defaultProps = {
  card: { label: '', data: '', date: '' },
  width: '300px',
}

export default StatCard
