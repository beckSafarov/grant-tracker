export const omit = (obj, props = []) => {
  const objDup = { ...obj }
  props.forEach((prop) => delete objDup[prop])
  return objDup
}

export const isEmptyObj = (obj) => (obj ? Object.keys(obj).length === 0 : false)

export const collect = (arr, prop) => arr.map((obj) => obj[prop])

export const getScreenWidths = (ratios = []) => {
  const width = window?.screen?.availWidth || 1440
  const sum = ratios.reduce((a, c) => (a += c), 0)
  const div = Math.floor(width / sum)
  return ratios.map((s) => div * s)
}

/**
 * @p1 url passed by the user
 * @p2 url format defined in the routes
 * @desc checks whether @p1 fits the @p2 format
 * @example
 *    @p1 /pi/1sd3oks/dashboard
 *    @p2 /pi/:id/dashboard
 *    returns true
 */
export const areEqualUrls = (p1, p2) => {
  if (!p2.match(/:id/)) return p1 === p2
  const arr1 = p1.split('/')
  const arr2 = p2.split('/')
  const idIndex = arr2.indexOf(':id')
  arr1.splice(idIndex, 1)
  arr2.splice(idIndex, 1)
  return arr1.join('/') === arr2.join('/')
}

export const getRandom = (max = 6, min = 1) => {
  return Math.floor(Math.random() * (max - min) + min)
}

export const getToken = () => getRandom(999999, 100000)

export const getStore = (store, fallBack = {}) => {
  const lcs = JSON.parse(localStorage.getItem(store))
  return lcs || fallBack
}

export const setStore = (store, body) =>
  localStorage.setItem(store, JSON.stringify(body))

export const getParams = () => {
  const res = {}
  const paramsString = window?.location?.search
  if (!paramsString) return {}
  const paramsList = paramsString.replace('?', '').split('&')
  paramsList.forEach((param) => {
    const [prop, val] = param.split('=')
    res[prop] = val
  })
  return res
}

export const renameProp = (obj, oldProp, newProp) => {
  const newObj = { ...obj }
  newObj[newProp] = newObj[oldProp]
  delete newObj[oldProp]
  return newObj
}

export const getCoResearcherEmails = ({ type, info }) =>
  type.match(/ru/)
    ? collect(info.projects, 'coResearcherEmail')
    : [info.coResearcherEmail]

export const commafy = (number) => {
  const s = number.toString()
  return s
    .split('')
    .map((char, i) => {
      const index = i + 1
      const putComma = index % 3 === 0 && index < s.length
      const isLastZero = s.length === i && char === '0'
      return putComma && !isLastZero ? `${char},` : char
    })
    .join('')
    .trim(',')
}

export const isDate = (param) => Boolean(param?.getTime)

export const isObject = (param) => param && typeof param === 'object'

export const isArray = (param) =>
  param && typeof param === 'object' && param?.length !== undefined

export const isPureObject = (param) => {
  if (!param || !isObject(param)) return false
  return !isDate(param) && !isArray(param) && param.size === undefined
}

/**
 * @desc checks whether an element is defined and contains value
 * @elem array|object|variable|null|undefined|NaN
 * @returns true|false
 */
export const isNone = (elem, exceptZero = false) => {
  if (exceptZero && elem === 0) return false
  if (!elem) return true
  if (isDate(elem)) return false
  if (isObject(elem)) return Object.keys(elem).length < 1
  return !Boolean(elem)
}

export const findNone = (arr = [], exceptZero = true) => {
  for (let i = 0; i < arr.length; i++) {
    if (isNone(arr[i], exceptZero)) return i
  }
  return -1
}

export const isAnyNone = (arr = []) => {
  return arr.some((curr) => isNone(curr))
}

/**
 * @arrs Arr [
 *  [prop1_Name, prop2_Name, prop3_Name], <-- table Header
 *  [prop1_Val1, prop2_Val1, prop3_Val1], <-- table values
 *  [prop1_Val2, prop2_Val2, prop2_Val3],
 *  ...
 * @returns [{prop1: prop1_Val1, ...}, ...]
 * ]
 */
export const getArrOfObjects = (arrs) => {
  if (isNone(arrs)) return []
  const props = arrs.shift()
  return arrs.map((arr) =>
    arr.reduce((a, c, i) => {
      a[props[i]] = c
      return a
    }, {})
  )
}

export const genObjectsArr = (sample = {}, n = 10) => {
  return Array(n).fill(sample, 0, n)
}

export const pluralize = (word, n) => (n === 1 ? word : word + 's')

export const getScreenWidth = () => {
  return window?.screen?.availWidth || 1440
}

export const getElemWidth = (elemId) => {
  return document.querySelector(`#${elemId}`)?.offsetWidth || 0
}
