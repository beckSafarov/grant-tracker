import React from 'react'

const ProgressBar = ({ progress: p, bg, label, width, borderRadius: bR }) => {
  const height = 0.1 * width
  const progress = (p / 100) * width
  return (
    <div
      style={{
        position: 'relative',
        width: width + 'px',
        height: height + 'px',
        backgroundColor: bg.base,
        borderRadius: bR,
      }}
    >
      <div
        style={{
          position: 'absolute',
          width: progress + 'px',
          height: '100%',
          backgroundColor: bg.completed,
          borderTopLeftRadius: bR,
          borderBottomLeftRadius: bR,
        }}
      ></div>
      <div
        style={{
          position: 'relative',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: '100%',
          fontSize: height / 2 + 'px',
        }}
      >
        {label}
      </div>
    </div>
  )
}

ProgressBar.defaultProps = {
  bg: {
    completed: '#52B788',
    base: '#CFDBD5',
  },
  label: '',
  width: 200,
  progress: 20,
  borderRadius: '5px',
}
export default ProgressBar
