import React from 'react'
import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableContainer from '@mui/material/TableContainer'
import TableHead from '@mui/material/TableHead'
import TableRow from '@mui/material/TableRow'
import { dateFormat } from '../helpers/dateHelpers'

const BasicTable = ({ columns, rows, hover }) => {
  const isDate = (elem) => Boolean(elem.toDate || elem.getFullYear)

  const handleDate = (date) => dateFormat(date.toDate ? date.toDate() : date)

  return (
    <TableContainer>
      <Table sx={{ minWidth: 650 }} aria-label='simple table'>
        <TableHead>
          <TableRow>
            {columns.map((column, i) => (
              <TableCell key={i} align={i === 0 ? 'left' : 'right'}>
                {column.label}
              </TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {rows.map((row, key) => (
            <TableRow
              key={key}
              sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
              hover={hover}
            >
              {columns.map((column, i) => {
                let value = row[column.field]
                if (isDate(value)) {
                  value = handleDate(value)
                }
                const first = i === 0
                return (
                  <TableCell
                    align={first ? 'left' : 'right'}
                    key={i}
                    // component='tr'
                    scope='row'
                  >
                    {value}
                  </TableCell>
                )
              })}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  )
}

BasicTable.defaultProps = {
  columns: [],
  rows: [],
  hover: false,
}

export default BasicTable
