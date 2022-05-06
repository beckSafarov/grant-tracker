import { useState } from 'react'
import Button from '@mui/material/Button'
import Menu from '@mui/material/Menu'
import MenuItem from '@mui/material/MenuItem'

function MenuDropDown({ label, options }) {
  const [anchorEl, setAnchorEl] = useState(null)
  const open = Boolean(anchorEl)
  const handleClick = (e) => {
    setAnchorEl(e.currentTarget)
  }
  const handleClose = () => setAnchorEl(null)

  const handleOptionClick = (fun) => {
    handleClose()
    fun()
  }

  return (
    <div>
      <Button
        id='demo-positioned-button'
        variant='outlined'
        aria-controls={open ? 'demo-positioned-menu' : undefined}
        aria-haspopup='true'
        aria-expanded={open ? 'true' : undefined}
        onClick={handleClick}
        size='small'
      >
        {label}
      </Button>
      <Menu
        id='demo-positioned-menu'
        aria-labelledby='demo-positioned-button'
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        anchorOrigin={{
          vertical: 'top',
          horizontal: 'left',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'left',
        }}
      >
        {options.map((option, i) => (
          <MenuItem
            key={i}
            sx={option.sx}
            onClick={() => handleOptionClick(option.onClick)}
          >
            {option.children}
          </MenuItem>
        ))}
      </Menu>
    </div>
  )
}

MenuDropDown.defaultProps = {
  label: 'Menu',
  options: [],
}

export default MenuDropDown
