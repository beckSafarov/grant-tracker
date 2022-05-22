import React, { useState } from 'react'
import Box from '@mui/material/Box'
import Tab from '@mui/material/Tab'
import TabContext from '@mui/lab/TabContext'
import TabList from '@mui/lab/TabList'
import TabPanel from '@mui/lab/TabPanel'
import StickyHeadTable from '../StickyHeadTable'
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

const byGrant = {
  columns: [
    { field: 'grant', label: 'Grant', mindWidth: 220 },
    { field: 'numbOfPapers', label: 'Number of Papers', mindWidth: 150 },
    { field: 'endDate', label: 'Deadline', mindWidth: 150 },
    { field: 'pi', label: 'PI', mindWidth: 200 },
  ],
  rows: [
    {
      grant: 'RU Trans',
      numbOfPapers: 3,
      endDate: 'Jan 1, 2024',
      pi: 'John Doe',
    },
    {
      grant: 'Bridging',
      numbOfPapers: 3,
      endDate: 'Jan 1, 2024',
      pi: 'John Doe',
    },
    {
      grant: 'RU Trans',
      numbOfPapers: 3,
      endDate: 'Jan 1, 2024',
      pi: 'John Doe',
    },
    {
      grant: 'RU Trans',
      numbOfPapers: 3,
      endDate: 'Jan 1, 2024',
      pi: 'John Doe',
    },
    {
      grant: 'RU Trans',
      numbOfPapers: 3,
      endDate: 'Jan 1, 2024',
      pi: 'John Doe',
    },
    {
      grant: 'RU Trans',
      numbOfPapers: 3,
      endDate: 'Jan 1, 2024',
      pi: 'John Doe',
    },
    {
      grant: 'RU Trans',
      numbOfPapers: 3,
      endDate: 'Jan 1, 2024',
      pi: 'John Doe',
    },
    {
      grant: 'RU Trans',
      numbOfPapers: 3,
      endDate: 'Jan 1, 2024',
      pi: 'John Doe',
    },
    {
      grant: 'RU Trans',
      numbOfPapers: 3,
      endDate: 'Jan 1, 2024',
      pi: 'John Doe',
    },
  ],
}

const Publications = () => {
  const [value, setValue] = useState('1')

  const handleChange = (e, v) => setValue(v)

  const byTitleSearchFilter = ({ title, grant, pi }, regex) =>
    title.match(regex) || grant.match(regex) || pi.match(regex)

  const byGrantSearchFilter = ({ grant, pi }, regex) =>
    grant.match(regex) || pi.match(regex)

  return (
    <TabContext value={value}>
      <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <TabList onChange={handleChange} aria-label='lab API tabs example'>
          <Tab label='By Title' value='1' />
          <Tab label='By Grant' value='2' />
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
          columns={byGrant.columns}
          rows={byGrant.rows}
          searchFilter={byGrantSearchFilter}
        />
      </TabPanel>
    </TabContext>
  )
}

export default Publications
