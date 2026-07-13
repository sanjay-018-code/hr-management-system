import React from 'react'
import { Navigate } from 'react-router-dom';
import Dashboard from './Hr-Components/HrDashboard/Dashboard';
import { isAuthenticated } from '../../utils/auth';

const Hr = () => {
    if(!isAuthenticated()){
        return <Navigate to="/" replace />
    }
    return(
        <div>
            <Dashboard/>
        </div>
    )
}

export default Hr;
