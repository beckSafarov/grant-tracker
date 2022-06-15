import { useState } from 'react'
import { logout } from '../firebase/auth'
import MenuDropDown from '../components/MenuDropDown'
import { getAllGrants } from '../firebase/grantControllers'
import {
  getMonthsAdded,
  isBefore,
  dateDiff,
  uniqDays,
  timeAgo,
  getWeekOfYear,
} from '../helpers/dateHelpers'
import { collect, getSameDatesSummed2 } from '../helpers'
import { getPubsById } from '../firebase/publicationsControllers'
import { upload } from '../firebase/uploadController'
import dayjs from 'dayjs'
import weekYear from 'dayjs/plugin/weekYear'
import weekOfYear from 'dayjs/plugin/weekOfYear'
import dayOfYear from 'dayjs/plugin/dayOfYear'

const shortGrantDummy = {
  type: 'short',
  startDate: new Date(),
  endDate: getMonthsAdded(12),
  info: {
    appCeiling: 42000,
    coResearcherEmail: 'beckSafari@yandex.com',
    period: 24,
    st: true,
  },
  uid: 'some-awesome-id-3423423',
}

const TestScreen = () => {
  const [imageUpload, setImageUpload] = useState(null)
  const arrWithDates = [
    { date: new Date('2022-6-10'), amount: 100 },
    { date: new Date('2022-6-10'), amount: 200 },
    { date: new Date('2022-6-10'), amount: 300 },
    { date: new Date('2022-6-11'), amount: 300 },
    { date: new Date('2022-6-12'), amount: 200 },
    { date: new Date('2022-6-13'), amount: 50 },
    { date: new Date('2022-6-13'), amount: 100 },
  ]

  const getWeekName = (number) => {
    dayjs.extend(dayOfYear)
    const daysTillWeek = (number - 1) * 7 - 5
    const dateBeforeWeek = dayjs(new Date()).dayOfYear(daysTillWeek)
    const beginning = dayjs(dateBeforeWeek).add(1, 'd').toDate()
    const end = dayjs(beginning).add(6, 'd').toDate()
    return { beginning, end, daysTillWeek }
  }

  const handleUpload = async () => {
    if (!imageUpload) return
    // const res = await upload(imageUpload)
    console.log(imageUpload)
  }
  // console.log(uniqDays(arrWithDates))
  const onClick = async () => {
    const currWeek = getWeekOfYear()
    const { beginning, end, daysTillWeek } = getWeekName(currWeek)
    const lastSunday = dayjs('2022-6-12').dayOfYear()
    console.log({
      nowWeek: currWeek,
      beginning: beginning.toDateString(),
      end: end.toDateString(),
      lastSunday,
      daysTillWeek,
    })
    // try {
    //   const res = await getPubsById(
    //     'grantId',
    //     '39a8386d-98f8-41c0-95ad-70ec6e6f2667'
    //   )
    //   console.log(res)
    // } catch (err) {
    //   console.error(err)
    // }
  }

  return (
    <div style={{ padding: '50px' }}>
      <h1>TestScreen</h1>
      <button style={{ marginBottom: '30px' }} onClick={onClick}>
        Click
      </button>
      <br />
      <input
        type='file'
        placeholder='Upload file'
        onChange={({ target }) => setImageUpload(target.files[0])}
        accept='image/jpg, image/jpeg, image/png, .pdf'
      />
      <button onClick={handleUpload}>Upload</button>
      <br />
    </div>
  )
}

export default TestScreen
