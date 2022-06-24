import produce from 'immer'

const useHandleChange = (onChange) => {
  const handleChange = (name, value) =>
    onChange(
      produce((draft) => {
        draft[name] = value
      })
    )

  return handleChange
}

export default useHandleChange
