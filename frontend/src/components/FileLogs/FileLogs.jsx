import React, { useState, useEffect } from 'react';
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
  { id: 'timestamp', label: 'Timestamp', minWidth: 200 },
  { id: 'user', label: 'User', minWidth: 150 },
  { id: 'group', label: 'Group', minWidth: 150 },
  { id: 'event', label: 'Event', minWidth: 150 },
  { id: 'file', label: 'File', minWidth: 250 },
  { id: 'listing', label: 'Blacklist/Whitelist', minWidth: 250 },
];

const FileLogs = () => {

  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);
  const [logs, setLogs] = useState([]);

  useEffect(() => {
    const fetchLogs = async () => {
      try {
        const response = await axios.get('http://127.0.0.1:5000/file_logs');
        setLogs(response.data.logs.reverse());
      } catch (error) {
        console.error('Error fetching logs:', error);
      }
    };
    fetchLogs();
  }, []);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  return (
    <>
      <main className="main-container">
        <div className="main-title">
          <h2>File Logs</h2>
        </div>
        <Paper style={{ backgroundColor: "#263043", color: "#fff" }} sx={{ width: '100%', overflow: 'hidden' }}>
          <TableContainer sx={{ maxHeight: 440 }}>
            <Table stickyHeader aria-label="sticky table">
              <TableHead>
                <TableRow>
                  {columns.map((column) => (
                    <TableCell
                      key={column.id}
                      align="left"
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
                  .map((row, index) => {
                    return (
                      <TableRow hover role="checkbox" tabIndex={-1} key={index}>
                        {columns.map((column) => {
                          const value = row[column.id];
                          return (
                            <TableCell style={{ borderBottom: "1px solid #656669", color: "#fff" }} key={column.id} align="left">
                              {value ? value : 'N/A'}
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

export default FileLogs