import React, { useState, useEffect } from 'react';
import axios from 'axios';
import "../NetworkLogs/NetworkLogs.css"
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';

const columns = [
  { id: 'listing', label: 'Listing', minWidth: 100 },
  { id: 'PID', label: 'PID', minWidth: 100 },
  { id: 'USER', label: 'USER', minWidth: 100 },
  { id: 'PR', label: 'PR', minWidth: 100 },
  { id: 'NI', label: 'NI', minWidth: 100 },
  { id: 'VIRT', label: 'VIRT', minWidth: 100 },
  { id: 'RES', label: 'RES', minWidth: 100 },
  { id: 'SHR', label: 'SHR', minWidth: 100 },
  { id: 'S', label: 'S', minWidth: 100 },
  { id: '%CPU', label: '%CPU', minWidth: 100 },
  { id: '%MEM', label: '%MEM', minWidth: 100 },
  { id: 'TIME+', label: 'TIME+', minWidth: 100 },
  { id: 'COMMAND', label: 'COMMAND', minWidth: 100 },
];

const LiveProcessLogs = () => {
  const [logs, setLogs] = useState([]);
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  useEffect(() => {
    axios.get('http://127.0.0.1:5000/liveprocess_logs')
      .then(response => {
        setLogs(response.data.logs.reverse());
      })
      .catch(error => {
        console.error('Error fetching live process logs:', error);
      });
  }, []);

  return (
    <>
      <main className="main-container">
        <div className="main-title">
          <h2>Live Process Logs</h2>
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
                {logs
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((row, index) => (
                    <TableRow hover role="checkbox" tabIndex={-1} key={index}>
                      {columns.map((column) => {
                        const value = row[column.id];
                        return (
                          <TableCell style={{ borderBottom: "1px solid #656669", color: "#fff" }} key={column.id} align="center">
                            {value}
                          </TableCell>
                        );
                      })}
                    </TableRow>
                  ))}
              </TableBody>
            </Table>
          </TableContainer>
          <TablePagination
            rowsPerPageOptions={[10, 25, 100]}
            component="div"
            count={logs.length}
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

export default LiveProcessLogs