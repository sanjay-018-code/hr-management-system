import React from 'react'
import Dashboard from './Hr-Components/HrDashboard/Dashboard'

const Admin = () => {
    return <Dashboard workspaceLabel='Admin Workspace' dashboardTitle='Admin Dashboard' routePrefix='/admin' showAdminReports />
}

export default Admin;
