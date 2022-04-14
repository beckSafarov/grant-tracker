export const withoutProps = (obj, props = []) => {
  const objDup = { ...obj }
  props.forEach((prop) => delete objDup[prop])
  return objDup
}
