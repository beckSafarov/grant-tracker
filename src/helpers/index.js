export const omit = (obj, props = []) => {
  const objDup = { ...obj }
  props.forEach((prop) => delete objDup[prop])
  return objDup
}

export const isEmptyObj = (obj) => {
  return obj ? Object.keys(obj).length === 0 : false
}


export const getScreenWidths = (ratios = []) => {
  const width = window?.screen?.availWidth || 1440
  const sum = ratios.reduce((a, c) => (a += c), 0)
  const div = Math.floor(width / sum)
  return ratios.map((s) => div * s)
}

