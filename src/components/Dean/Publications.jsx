import React, { useState } from 'react'
import Box from '@mui/material/Box'
import Tab from '@mui/material/Tab'
import TabContext from '@mui/lab/TabContext'
import TabList from '@mui/lab/TabList'
import TabPanel from '@mui/lab/TabPanel'
import StickyHeadTable from '../StickyHeadTable'
import { grantOptions } from '../../config'
import { random } from 'lodash'

const getSamplePIData = () => {
  const grants = Object.values(grantOptions)
  const names = [
    'John Doe',
    'Dean Brown',
    'Tom Smith',
    'Robert Smith',
    'Robert Patterson',
    'Miles Tone',
    'Brian Cumin',
  ]

  return names.map((name, i) => ({
    grant: grants[random(0, grants.length - 1)],
    numbOfPapers: random(0, 5),
    endDate: `Jan ${i + 1}, 2024`,
    pi: name,
  }))
}

const byPI = {
  columns: [
    { field: 'pi', label: 'PI', mindWidth: 200 },
    { field: 'grant', label: 'Grant', mindWidth: 220 },
    { field: 'numbOfPapers', label: 'Number of Papers', mindWidth: 150 },
    { field: 'endDate', label: 'Deadline', mindWidth: 150 },
  ],
  rows: getSamplePIData(),
}

const Publications = () => {
  const [value, setValue] = useState('1')

  const handleChange = (e, v) => setValue(v)

  const byTitleSearchFilter = ({ title, grant, pi }, regex) =>
    title.match(regex) || grant.match(regex) || pi.match(regex)

  const byGrantSearchFilter = ({ grant, pi }, regex) =>
    grant.match(regex) || pi.match(regex)

  const byTitle = {
    columns: [
      { field: 'title', label: 'Title', mindWidth: 200 },
      { field: 'grant', label: 'Grant', mindWidth: 200 },
      { field: 'pi', label: 'PI', mindWidth: 200 },
      { field: 'endDate', label: 'Research Deadline', mindWidth: 180 },
    ],
    rows: [
      {
        title: 'Lorem ipsum dolor',
        grant: 'RU Team',
        pi: 'John Doe',
        endDate: 'Jan 1, 2024',
      },
      {
        title: 'Lorem ipsum dolor',
        grant: 'RU Team',
        pi: 'John Doe',
        endDate: 'Jan 1, 2024',
      },
      {
        title: 'Lie detecting using AI',
        grant: 'RU Team',
        pi: 'John Doe',
        endDate: 'Jan 1, 2024',
      },
      {
        title: 'Lorem ipsum dolor',
        grant: 'RU Team',
        pi: 'Ernest Bravo',
        endDate: 'Jan 1, 2024',
      },
      {
        title: 'Lorem ipsum dolor',
        grant: 'Bridging',
        pi: 'John Doe',
        endDate: 'Jan 1, 2024',
      },
      {
        title: 'Lorem ipsum dolor',
        grant: 'RU Team',
        pi: 'John Doe',
        endDate: 'Jan 1, 2024',
      },
      {
        title: 'Lorem ipsum dolor',
        grant: 'RU Team',
        pi: 'John Doe',
        endDate: 'Jan 1, 2024',
      },
      {
        title: 'Lorem ipsum dolor',
        grant: 'RU Team',
        pi: 'John Doe',
        endDate: 'Jan 1, 2024',
      },
      {
        title: 'Lorem ipsum dolor',
        grant: 'RU Team',
        pi: 'John Doe',
        endDate: 'Jan 1, 2024',
      },
      {
        title: 'Lorem ipsum dolor',
        grant: 'RU Team',
        pi: 'John Doe',
        endDate: 'Jan 1, 2024',
      },
    ],
  }

  return (
    <TabContext value={value}>
      <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <TabList onChange={handleChange} aria-label='lab API tabs example'>
          <Tab label='By Title' value='1' />
          <Tab label='By PI' value='2' />
        </TabList>
      </Box>
      <TabPanel value='1'>
        <StickyHeadTable
          columns={byTitle.columns}
          rows={byTitle.rows}
          searchFilter={byTitleSearchFilter}
        />
      </TabPanel>
      <TabPanel value='2'>
        <StickyHeadTable
          columns={byPI.columns}
          rows={byPI.rows}
          searchFilter={byGrantSearchFilter}
        />
      </TabPanel>
    </TabContext>
  )
}

export default Publications
