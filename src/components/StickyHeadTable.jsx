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
import { useNavigate } from 'react-router-dom'
import { truncate } from 'lodash'


/**
 * @columns Arr [{field, label, mindWidth}]
 * @rows Arr [{field: fieldValue}]
 */
const StickyHeadTable = ({
  columns,
  rows,
  title,
  searchBy: searchableProps,
  maxLength,
}) => {
  const [page, setPage] = useState(0)
  const theme = useTheme()
  const navigate = useNavigate()
  const [rowsPerPage, setRowsPerPage] = useState(5)
  const [dataForRows, setDataForRows] = useState([])

  const setUpDataForCurrPage = () => {
    setDataForRows(
      rows.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
    )
  }

  useEffect(() => setUpDataForCurrPage(), [rows, page, rowsPerPage])

  const handleSearch = (keyword) => {
    const regex = new RegExp(keyword, 'gi')
    if (keyword) {
      const findRowForKeyword = (row) =>
        searchableProps.some((prop) => row[prop].match(regex))

      setDataForRows(rows.filter(findRowForKeyword))
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

  const handleRowClick = ({ link, onClick }) => {
    if (link) navigate(link)
    if (onClick) onClick()
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
          {title}
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
              <TableRow
                hover
                tabIndex={-1}
                key={i}
                sx={{ cursor: row.link || row.onClick ? 'pointer' : '' }}
                onClick={() => handleRowClick(row)}
              >
                {columns.map((column, i) => {
                  let value = row[column.field]
                  value = maxLength
                    ? truncate(value, { length: +maxLength })
                    : value
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
  searchBy: [],
  title: '',
}
export default StickyHeadTable 
