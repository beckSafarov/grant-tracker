import dayjs from 'dayjs'
import { defaultHomePages } from '../config'

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

export const getMonthsAdded = (n) => {
  return new Date(dayjs().add(n, 'month'))
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
