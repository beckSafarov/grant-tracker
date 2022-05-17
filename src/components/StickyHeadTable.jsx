import { useState, useEffect } from 'react'
import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableContainer from '@mui/material/TableContainer'
import TableHead from '@mui/material/TableHead'
import TablePagination from '@mui/material/TablePagination'
import TableRow from '@mui/material/TableRow'
import { Stack, TextField, Typography, useTheme } from '@mui/material'
import Box from '@mui/system/Box'

const StickyHeadTable = ({ columns, rows, searchFilter }) => {
  const [page, setPage] = useState(0)
  const theme = useTheme()
  const [rowsPerPage, setRowsPerPage] = useState(5)
  const [dataForRows, setDataForRows] = useState([])

  const setUpDataForCurrPage = () => {
    setDataForRows(
      rows.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
    )
  }

  useEffect(() => setUpDataForCurrPage(), [rows, page, rowsPerPage])

  const handleSearch = (keyword) => {
    const regex = new RegExp(keyword, 'i')
    if (keyword) {
      setDataForRows(rows.filter((rowVals) => searchFilter(rowVals, regex)))
      return
    }
    setUpDataForCurrPage()
  }

  const handleChangePage = (event, newPage) => {
    setPage(newPage)
  }

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value)
    setPage(0)
  }

  return (
    <>
      <Stack
        p={2}
        direction='row'
        justifyContent='space-between'
        alignItems='center'
      >
        <Typography fontWeight='500' color={theme.text.blue} fontSize='1rem'>
          All Researches
        </Typography>
        <Box display='flex' alignItems='center'>
          <TextField
            id='outlined-basic'
            label='Search'
            variant='standard'
            height='fit-content'
            onChange={(e) => handleSearch(e.target.value)}
          />
        </Box>
      </Stack>
      <TableContainer sx={{ maxHeight: 400 }}>
        <Table stickyHeader aria-label='sticky table'>
          <TableHead>
            <TableRow>
              {columns.map((column, i) => (
                <TableCell key={i} style={{ minWidth: column.minWidth }}>
                  {column.label}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {dataForRows.map((row, i) => (
              <TableRow hover role='checkbox' tabIndex={-1} key={i}>
                {columns.map((column, i) => {
                  const value = row[column.field]
                  return <TableCell key={i}>{value}</TableCell>
                })}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        rowsPerPageOptions={[5, 8, 10]}
        component='div'
        count={rows.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
    </>
  )
}

StickyHeadTable.defaultProps = {
  searchFilter: () => void 0,
}
export default StickyHeadTable 