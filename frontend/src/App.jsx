import { useState } from 'react'
import './App.css'
import Sidebar from './components/Sidebar/Sidebar'
import Header from './components/Header/Header'
import HeroSection from './components/HeroSection/HeroSection'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import NetworkLogs from './components/NetworkLogs/NetworkLogs'
import FileLogs from './components/FileLogs/FileLogs'
import ProcessLogs from './components/ProcessLogs/ProcessLogs'
import MemoryLogs from './components/MemoryLogs/MemoryLogs'
import LiveProcessLogs from './components/LiveProcessLogs/LiveProcessLogs'


function App() {

  return (
    <>
      <div className="grid-container">
        <Router>
          <Header />
          <Sidebar />
          <Routes>
            <Route path="/" element={<HeroSection />} />
            <Route path="/dashboard" element={<HeroSection />} />
            <Route path="/network_logs" element={<NetworkLogs />} />
            <Route path="/file_logs" element={<FileLogs />} />
            <Route path="/processing_logs" element={<ProcessLogs />} />
            <Route path="/memory_logs" element={<MemoryLogs />} />
            <Route path="/liveprocess_logs" element={<LiveProcessLogs />} />
          </Routes>
        </Router>
      </div>
    </>
  )
}

export default App
