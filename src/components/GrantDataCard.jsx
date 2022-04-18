import { useState } from 'react'
import { Paper, Stack, Typography, useTheme } from '@mui/material'

const GrantDataCard = ({ card, onClick }) => {
  const theme = useTheme()
  const [bg, setBg] = useState('#fff')
  const texts = [
    {
      fontSize: '2rem',
      color: theme.text.blue,
      fontWeight: '500',
      body: card.title,
    },
    {
      fontSize: '1rem',
      fontWeight: '500',
      body: card.grantType,
    },
    {
      fontSize: '0.8rem',
      fontWeight: '500',
      color: 'rgb(0, 0, 0, 0.6)',
      body: card.date,
    },
  ]

  return (
    <Paper
      elevation={1}
      sx={{
        padding: '15px',
        width: '300px',
        cursor: 'pointer',
        backgroundColor: bg,
      }}
      onMouseEnter={() => setBg('#f5f5f5')}
      onMouseLeave={() => setBg('#fff')}
      onClick={onClick}
    >
      <Stack spacing={1}>
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
      </Stack>
    </Paper>
  )
}

GrantDataCard.defaultProps = {
  card: { label: '', data: '', date: '' },
  onClick: () => void 0,
}

export default GrantDataCard
