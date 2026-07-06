import React from 'react'
import { useState, useEffect } from 'react'
import { Navigate } from 'react-router-dom'

import AttendancePieChart from './Piechart'

import { apiClient } from '../../../utils/api-client'
import {getCurrentUser, isAuthenticated} from '../../../utils/auth' 
import DashboardCard from './DashboardCard'

const Dashboard = () => {
    
    const [attendance, setAttendance] = useState(null)
    const [dashboard, setDashboard] = useState(null)
    const [error, setError] = useState("")

    const fetchDashboard = async () => {
        await apiClient.get("/dashboard").then(
            response => {
                setDashboard(response.data)
            }
        ).catch(error => {
            console.log(error);
            setError(error.message)
        })
    }
    
    
    const fetchAttendance = async () => {
        await apiClient.get("/dashboard/chart").then(
            response => {
                setAttendance(response.data)
            }
        ).catch(error => {
            console.log(error);
            setError(error.message)
        })
    }

    useEffect(()=>{
        fetchAttendance(),
        fetchDashboard()
    },[])

    const user = getCurrentUser()

  return (
    <div className='bg-[#e3e3e3]' >
        <h1 className='block text-3xl font-bold bg-[#f78889] p-6 rounded m-1' >
            HR Dashboard
        </h1>
        {user && <p className='text-2xl text-red-800 font-bold font ml-7' >Welcome {user.username} !!</p>}
        {error && <p className='ml-7 text-red-500'>{error}</p>}
        <DashboardCard data={dashboard} />
        {!attendance && !error && <p className='ml-7 text-gray-500'>Loading attendance chart...</p>}
        <h1 className='flex items-center justify-center text-6xl font-bold p-6 rounded m-1' >
            Attendance
        </h1>
        <AttendancePieChart attendance={attendance}/>
    </div>
  )
}

export default Dashboard