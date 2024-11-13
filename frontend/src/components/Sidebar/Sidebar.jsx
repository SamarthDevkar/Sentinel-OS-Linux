import React from 'react'
import "./Sidebar.css";
import { Link } from "react-router-dom";
import LogoLong from "../../assets/logo_long.png"

const Sidebar = () => {
    return (
        <>
            <aside id="sidebar">
                <div className="sidebar-title">
                    <div className="sidebar-brand">
                        <img src={LogoLong} alt="logo" width={250}/>
                    </div>
                    <span className="material-icons-outlined">close</span>
                </div>

                <ul className="sidebar-list">
                    <li className="sidebar-list-item">
                        <Link to="/dashboard">
                            <span className="material-symbols-outlined">
                                dashboard
                            </span>Dashboard
                        </Link>
                    </li>
                    <li className="sidebar-list-item">
                        <Link to="/network_logs">
                            <span className="material-symbols-outlined">
                                lan
                            </span>Network Logs
                        </Link>
                    </li>
                    <li className="sidebar-list-item">
                        <Link to="/file_logs">
                            <span className="material-symbols-outlined">
                                description
                            </span> File Logs
                        </Link>
                    </li>
                    <li className="sidebar-list-item">
                        <Link to="/processing_logs">
                            <span className="material-symbols-outlined">
                                memory_alt
                            </span> Process Logs
                        </Link>
                    </li>
                    <li className="sidebar-list-item">
                        <Link to="/memory_logs">
                            <span className="material-symbols-outlined">
                                memory
                            </span> Memory Logs
                        </Link>
                    </li>
                    <li className="sidebar-list-item">
                        <Link to="/liveprocess_logs">
                            <span className="material-symbols-outlined">
                                stream
                            </span> Live Process Logs
                        </Link>
                    </li>
                </ul>
            </aside>
        </>
    )
}

export default Sidebar