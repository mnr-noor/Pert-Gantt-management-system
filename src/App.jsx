import React from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom';
import pic from './assets/Time management-cuate.svg';
import logo from'./assets/logo.png'
// Import your components for PertChart and GanttChart
import PertChart from './components/PertChart';
import GanttChart from './components/GanttChart';

// HomePage Component with Buttons that Navigate
const HomePage = () => {
    const navigate = useNavigate();

    return (
        <div style={{ padding: '10px',marginLeft:'90px' }}>
            {/* Navbar with logo on the left */}
            <nav style={{  backgroundColor: 'white', display: 'flex', alignItems: 'center' }}>
                <img src={logo} alt="Logo" style={{ width: '120px', height: '120px' }} />
            </nav>

            {/* Main content */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginTop: '70px' }}>
                <div>
                    <h1 style={{ fontSize: '3rem', color: '#3b4e56',fontWeight: 'bold'   }}>PERT AND GANTT Management System</h1>
                    <p style={{ fontSize: '2em', color: '#555', marginTop:'20px' }}>
                        This tool allows you to manage projects using PERT and Gantt charts. Choose the chart to get started.
                    </p>
                    <div style={{ marginTop: '20px' }}>
                        <button 
                            onClick={() => navigate('/pert')}
                            style={{
                                margin: '10px',
                                padding: '10px 20px',
                                backgroundColor: '#ecb62c',
                                color: '#3b4e56',
                                border: 'none',
                                borderRadius: '5px',
                                cursor: 'pointer',
                            }}
                        >
                            PERT Chart
                        </button>
                        <button 
                            onClick={() => navigate('/gantt')}
                            style={{
                                margin: '10px',
                                padding: '10px 20px',
                                backgroundColor: '#3b4e56',
                                color: 'white',
                                border: 'none',
                                borderRadius: '5px',
                                cursor: 'pointer',
                            }}
                        >
                            Gantt Chart
                        </button>
                    </div>
                </div>
                
                {/* Right side: image (resize it properly) */}
                <div>
                    <img src={pic} alt="Project Management" style={{ maxWidth: '70%', height: 'auto', marginLeft:'50px', }} />
                </div>
            </div>
        </div>
    );
};

// Main App Component with Routes
const App = () => {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<HomePage />} />
                {/* Routes to PertChart and GanttChart components */}
                <Route path="/gantt" element={<GanttChart />} />
                <Route path="/pert" element={<PertChart />} />
            </Routes>
        </Router>
    );
};

export default App;
