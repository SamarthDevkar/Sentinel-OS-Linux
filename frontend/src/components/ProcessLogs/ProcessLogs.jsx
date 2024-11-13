import React, { useState, useEffect } from 'react'
import "../NetworkLogs/NetworkLogs.css"
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import axios from 'axios';

const columns = [
  { id: 'PID', label: 'PID', minWidth: 100 },
  { id: 'RSS', label: 'RSS', minWidth: 100 },
  { id: 'VSZ', label: 'VSZ', minWidth: 100 },
  { id: 'CMD', label: 'CMD', minWidth: 100 },
  { id: 'State', label: 'State', minWidth: 100 },
  { id: 'Threads', label: 'Threads', minWidth: 100 },
  { id: 'RssAnon', label: 'RSS Anon', minWidth: 100 },
  { id: 'RssFile', label: 'RSS File', minWidth: 100 },
  { id: 'RssShmem', label: 'RSS Shmem', minWidth: 100 },
  { id: 'date', label: 'Date', minWidth: 150 },
];

const ProcessLogs = () => {

  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);
  const [rows, setRows] = useState([]);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  useEffect(() => {
    axios.get('http://127.0.0.1:5000/process_info')
      .then(response => {
        setRows(response.data.reverse());
      })
      .catch(error => {
        console.error('Error fetching data:', error);
      });
  }, []);

  return (
    <>
      {/* <main className="main-container">
        <div className="main-title">
          <h2>Processing Logs</h2>
        </div>

        <Paper style={{ backgroundColor: "#263043", color: "#fff" }} sx={{ width: '100%', overflow: 'hidden' }}>
          <TableContainer sx={{ maxHeight: 440 }}>
            <Table stickyHeader aria-label="sticky table">
              <TableHead>
                <TableRow>
                  {columns.map((column) => (
                    <TableCell
                      key={column.id}
                      align={column.align}
                      style={{ minWidth: column.minWidth, backgroundColor: "#263043", borderBottom: "1px solid #656669", color: "#fff" }}
                    >
                      {column.label}
                    </TableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody style={{ backgroundColor: "#263043" }}>
                {rows
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((row) => {
                    return (
                      <TableRow hover role="checkbox" tabIndex={-1} key={row.code}>
                        {columns.map((column) => {
                          const value = row[column.id];
                          return (
                            <TableCell style={{ borderBottom: "1px solid #656669", color: "#fff" }} key={column.id} align={column.align}>
                              {column.format && typeof value === 'number'
                                ? column.format(value)
                                : value}
                            </TableCell>
                          );
                        })}
                      </TableRow>
                    );
                  })}
              </TableBody>
            </Table>
          </TableContainer>
          <TablePagination
            rowsPerPageOptions={[10, 25, 100]}
            component="div"
            count={rows.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
            style={{ color: "#fff" }}
          />
        </Paper>

      </main> */}

      <main className="main-container">
        <div className="main-title">
          <h2>Process Logs</h2>
        </div>

        <Paper style={{ backgroundColor: "#263043", color: "#fff" }} sx={{ width: '100%', overflow: 'hidden' }}>
          <TableContainer sx={{ maxHeight: 440 }}>
            <Table stickyHeader aria-label="sticky table">
              <TableHead>
                <TableRow>
                  {columns.map((column) => (
                    <TableCell
                      key={column.id}
                      align="center"
                      style={{ minWidth: column.minWidth, backgroundColor: "#263043", borderBottom: "1px solid #656669", color: "#fff" }}
                    >
                      {column.label}
                    </TableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody style={{ backgroundColor: "#263043" }}>
                {rows
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((row, index) => {
                    return (
                      <TableRow hover role="checkbox" tabIndex={-1} key={index}>
                        {columns.map((column) => {
                          const value = row[column.id] || "N/A";
                          return (
                            <TableCell style={{ borderBottom: "1px solid #656669", color: "#fff" }} key={column.id} align="center">
                              {value !== "" ? value : "N/A"}
                            </TableCell>
                          );
                        })}
                      </TableRow>
                    );
                  })}
              </TableBody>
            </Table>
          </TableContainer>
          <TablePagination
            rowsPerPageOptions={[10, 25, 100]}
            component="div"
            count={rows.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
            style={{ color: "#fff" }}
          />
        </Paper>
      </main>
    </>
  )
}

export default ProcessLogs