const changeElemBg = (e, bg) => {
  const id = e.target.id
  const elem = document.querySelector(`#${id}`)
  elem.style.backgroundColor = bg
}

const useHover = (defaultColor, colorOnHover) => {
  const onMouseEnter = (e) => changeElemBg(e, colorOnHover)

  const onMouseLeave = (e) => changeElemBg(e, defaultColor)

  return { onMouseEnter, onMouseLeave }
}

export default useHover
