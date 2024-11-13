import React, { useEffect, useState } from 'react';
import ApexCharts from 'apexcharts';
import "./HeroSection.css";
import { Link } from 'react-router-dom';
import axios from 'axios';
import BlockIcon from '@mui/icons-material/Block';
import VerifiedIcon from '@mui/icons-material/Verified';
import ReportIcon from '@mui/icons-material/Report';

const HeroSection = () => {

  const [blacklistedCounts, setBlacklistedCounts] = useState({ network: 0, file: 0, liveprocess: 0 });
  const [whitelistedCounts, setWhitelistedCounts] = useState({ network: 0, file: 0, liveprocess: 0 });

  useEffect(() => {
    const fetchCounts = async () => {
      try {
        const [networkResponse, fileResponse, liveprocessResponse] = await Promise.all([
          axios.get('http://127.0.0.1:5000/network_logs'),
          axios.get('http://127.0.0.1:5000/file_logs'),
          axios.get('http://127.0.0.1:5000/liveprocess_logs')
        ]);

        const networkBlacklistedCount = networkResponse.data.blacklisted_count || 0;
        const networkWhitelistedCount = networkResponse.data.whitelisted_count || 0;

        const fileBlacklistedCount = fileResponse.data.blacklisted_count || 0;
        const fileWhitelistedCount = fileResponse.data.whitelisted_count || 0;

        const liveprocessBlacklistedCount = liveprocessResponse.data.blacklisted_count || 0;
        const liveprocessWhitelistedCount = liveprocessResponse.data.whitelisted_count || 0;

        setBlacklistedCounts({
          network: networkBlacklistedCount,
          file: fileBlacklistedCount,
          liveprocess: liveprocessBlacklistedCount
        });

        setWhitelistedCounts({
          network: networkWhitelistedCount,
          file: fileWhitelistedCount,
          liveprocess: liveprocessWhitelistedCount
        });
      } catch (error) {
        console.error('Error fetching counts:', error);
      }
    };

    fetchCounts();
  }, []);

  const handleDownloadLogs = () => {
    axios.get('http://127.0.0.1:5000/download_all_files', { responseType: 'blob' })
      .then(response => {
        const url = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', 'myzipfile.zip');
        document.body.appendChild(link);
        link.click();
      })
      .catch(error => {
        console.error('Error downloading logs:', error);
      });
  };



  return (
    <main className="main-container">
      <div className="main-title">
        <h2>DASHBOARD</h2>
      </div>

      <div className="main-cards">

        <div className="card">
          <div className="card-inner">
            <h3>Blacklisted</h3>
            <BlockIcon style={{ fontSize: "45px" }} />
          </div>
          <h1>{blacklistedCounts.network + blacklistedCounts.file + blacklistedCounts.liveprocess}</h1>
        </div>

        <div className="card">
          <div className="card-inner">
            <h3>Whitelisted</h3>
            <VerifiedIcon style={{ fontSize: "45px" }} />
          </div>
          <h1>{whitelistedCounts.network + whitelistedCounts.file + whitelistedCounts.liveprocess}</h1>
        </div>

        <div className="card">
          <div className="card-inner">
            <h3>ALERTS</h3>
            <ReportIcon style={{ fontSize: "50px" }} />
          </div>
          <h1>{blacklistedCounts.network + blacklistedCounts.file + blacklistedCounts.liveprocess}</h1>
        </div>

      </div>

      <Link className='download_logs'>
        <button className="button-87" onClick={handleDownloadLogs} role="button">Download All Logs</button>
      </Link>

    </main>
  );
}

export default HeroSection;
