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

const MemoryLogs = () => {

  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);
  const [logs, setLogs] = useState([]);

  useEffect(() => {
    const fetchMemoryLogs = async () => {
      try {
        const response = await axios.get('http://127.0.0.1:5000/memory_logs');
        setLogs(response.data.logs.reverse());
      } catch (error) {
        console.error('Error fetching memory logs:', error);
      }
    };

    fetchMemoryLogs();
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
          <h2>Memory Logs</h2>
        </div>

        <Paper style={{ backgroundColor: "#263043", color: "#fff" }} sx={{ width: '100%', overflow: 'hidden' }}>
          <TableContainer sx={{ maxHeight: 440 }}>
            <Table stickyHeader aria-label="sticky table">
              <TableHead>
                <TableRow>
                  <TableCell style={{ minWidth: 170, backgroundColor: "#263043", borderBottom: "1px solid #656669", color: "#fff" }}>Time</TableCell>
                  <TableCell style={{ minWidth: 170, backgroundColor: "#263043", borderBottom: "1px solid #656669", color: "#fff" }}>kbmemfree</TableCell>
                  <TableCell style={{ minWidth: 170, backgroundColor: "#263043", borderBottom: "1px solid #656669", color: "#fff" }}>kbavail</TableCell>
                  <TableCell style={{ minWidth: 170, backgroundColor: "#263043", borderBottom: "1px solid #656669", color: "#fff" }}>kbmemused</TableCell>
                  <TableCell style={{ minWidth: 170, backgroundColor: "#263043", borderBottom: "1px solid #656669", color: "#fff" }}>%memused</TableCell>
                  <TableCell style={{ minWidth: 170, backgroundColor: "#263043", borderBottom: "1px solid #656669", color: "#fff" }}>kbbuffers</TableCell>
                  <TableCell style={{ minWidth: 170, backgroundColor: "#263043", borderBottom: "1px solid #656669", color: "#fff" }}>kbcached</TableCell>
                  <TableCell style={{ minWidth: 170, backgroundColor: "#263043", borderBottom: "1px solid #656669", color: "#fff" }}>kbcommit</TableCell>
                  <TableCell style={{ minWidth: 170, backgroundColor: "#263043", borderBottom: "1px solid #656669", color: "#fff" }}>%commit</TableCell>
                  <TableCell style={{ minWidth: 170, backgroundColor: "#263043", borderBottom: "1px solid #656669", color: "#fff" }}>kbactive</TableCell>
                  <TableCell style={{ minWidth: 170, backgroundColor: "#263043", borderBottom: "1px solid #656669", color: "#fff" }}>kbinact</TableCell>
                  <TableCell style={{ minWidth: 170, backgroundColor: "#263043", borderBottom: "1px solid #656669", color: "#fff" }}>kbdirty</TableCell>
                </TableRow>
              </TableHead>
              <TableBody style={{ backgroundColor: "#263043" }}>
                {logs
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((log, index) => (
                    <TableRow hover role="checkbox" tabIndex={-1} key={index}>
                      <TableCell style={{ borderBottom: "1px solid #656669", color: "#fff" }}>{log.time}</TableCell>
                      <TableCell style={{ borderBottom: "1px solid #656669", color: "#fff" }}>{log.kbmemfree}</TableCell>
                      <TableCell style={{ borderBottom: "1px solid #656669", color: "#fff" }}>{log.kbavail}</TableCell>
                      <TableCell style={{ borderBottom: "1px solid #656669", color: "#fff" }}>{log.kbmemused}</TableCell>
                      <TableCell style={{ borderBottom: "1px solid #656669", color: "#fff" }}>{log['%memused']}</TableCell>
                      <TableCell style={{ borderBottom: "1px solid #656669", color: "#fff" }}>{log.kbbuffers}</TableCell>
                      <TableCell style={{ borderBottom: "1px solid #656669", color: "#fff" }}>{log.kbcached}</TableCell>
                      <TableCell style={{ borderBottom: "1px solid #656669", color: "#fff" }}>{log.kbcommit}</TableCell>
                      <TableCell style={{ borderBottom: "1px solid #656669", color: "#fff" }}>{log['%commit']}</TableCell>
                      <TableCell style={{ borderBottom: "1px solid #656669", color: "#fff" }}>{log.kbactive}</TableCell>
                      <TableCell style={{ borderBottom: "1px solid #656669", color: "#fff" }}>{log.kbinact}</TableCell>
                      <TableCell style={{ borderBottom: "1px solid #656669", color: "#fff" }}>{log.kbdirty}</TableCell>
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

export default MemoryLogs