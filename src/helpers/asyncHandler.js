const asyncHandler = async (func) => {
  try {
    await func()
  } catch (err) {
    return err
  }
}

export default asyncHandler
