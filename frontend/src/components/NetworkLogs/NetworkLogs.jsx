import React, { useState, useEffect } from 'react';
import "./NetworkLogs.css"
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
    { id: 'frame.number', label: 'Frame Number', minWidth: 100 },
    { id: 'frame.date', label: 'Frame Date', minWidth: 200 },
    { id: 'ip.src', label: 'Source IP', minWidth: 150 },
    { id: 'ip.dst', label: 'Destination IP', minWidth: 150 },
    { id: 'tcp.srcport', label: 'TCP Source Port', minWidth: 150 },
    { id: 'tcp.dstport', label: 'TCP Destination Port', minWidth: 150 },
    { id: 'udp.srcport', label: 'UDP Source Port', minWidth: 150 },
    { id: 'udp.dstport', label: 'UDP Destination Port', minWidth: 150 },
    { id: 'frame.len', label: 'Frame Length', minWidth: 150 },
    { id: 'frame.protocols', label: 'Frame Protocols', minWidth: 200 },
    { id: 'listing', label: 'Listing', minWidth: 150 },
];


const NetworkLogs = () => {
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [logs, setLogs] = useState([]);

    useEffect(() => {
        axios.get('http://127.0.0.1:5000/network_logs')
            .then(response => {
                const updatedLogs = response.data.logs.map(log => {
                    const dateString = log['frame.time'];
                    const dateParts = dateString.split(' ');
                    const formattedDateString = `${dateParts[0]} ${dateParts[1]} ${dateParts[3]} ${dateParts[4]}`;

                    const date = formattedDateString ? new Date(formattedDateString) : null;
                    const formattedDate = date ? `${date.getDate().toString().padStart(2, '0')}/${(date.getMonth() + 1).toString().padStart(2, '0')}/${(date.getFullYear() % 100).toString().padStart(2, '0')} ${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}:${date.getSeconds().toString().padStart(2, '0')}` : 'N/A';

                    return {
                        ...log,
                        'frame.date': formattedDate,
                        'frame.number': log['frame.number'] || 'N/A',
                        'ip.src': log['ip.src'] || 'N/A',
                        'ip.dst': log['ip.dst'] || 'N/A',
                        'tcp.srcport': log['tcp.srcport'] || 'N/A',
                        'tcp.dstport': log['tcp.dstport'] || 'N/A',
                        'udp.srcport': log['udp.srcport'] || 'N/A',
                        'udp.dstport': log['udp.dstport'] || 'N/A',
                        'frame.len': log['frame.len'] || 'N/A',
                        'frame.protocols': log['frame.protocols'] || 'N/A',
                        'listing': log['listing'] || 'N/A',
                    };
                });
                setLogs(updatedLogs.reverse());
            })
            .catch(error => console.error('Error fetching network logs:', error));
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
                    <h2>Network Logs</h2>
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
                                                            {value}
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

export default NetworkLogs