import React from 'react'
import { useNavigate } from 'react-router-dom'

const cardStyles = {
  total_employees: 'border-slate-200 bg-slate-50 text-slate-800',
  total_departments: 'border-slate-200 bg-slate-50 text-slate-800',
  present_today: 'border-emerald-200 bg-emerald-50 text-emerald-800',
  absent_today: 'border-red-200 bg-red-50 text-red-800',
}

const DashboardCard = ({ data }) => {
  const navigate = useNavigate()
  const safeData = data ?? {}
  const cards = [
    { key: 'total_employees', label: 'Total Employees', value: safeData.total_employees ?? 0, route: '/hr/employees' },
    { key: 'total_departments', label: 'Total Departments', value: safeData.total_departments ?? 0, route: '/hr/departments' },
    { key: 'present_today', label: 'Present Today', value: safeData.present_today ?? 0 },
    { key: 'absent_today', label: 'Absent Today', value: safeData.absent_today ?? 0 }
  ]

  const handleClick = (route) => {
    if (route) {
      navigate(route)
    }
  }

  const handleLeaveClick = () => {
    navigate("/hr/leave")
  }
  const handleAttClick = () => {
    navigate("/hr/attendance")
  }

  return (
    <div className='mb-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4'>
      {data && cards.map((card) => (
        <div
          key={card.key}
          onClick={() => handleClick(card.route)}
          className={`rounded-lg border p-4 ${cardStyles[card.key]} ${card.route ? 'cursor-pointer hover:opacity-90' : ''}`}
        >
          <p className='text-sm font-semibold'>{card.label}</p>
          <p className='mt-1 text-3xl font-bold'>{card.value}</p>
        </div>
      ))}

      {data && (
        <div
          className='flex cursor-pointer items-center justify-between rounded-lg border border-amber-200 bg-amber-50 p-4 text-amber-800 hover:opacity-90 sm:col-span-2'
          onClick={handleLeaveClick}
        >
          <p className='text-sm font-semibold'>Pending Leave</p>
          <p className='text-3xl font-bold text-amber-950'>{safeData.pending_leaves ?? 0}</p>
        </div>
      )}

      <div
        className='flex cursor-pointer items-center justify-center rounded-lg bg-slate-800 p-4 text-lg font-bold text-white hover:bg-slate-700 sm:col-span-2'
        onClick={handleAttClick}
      >
        Mark Attendance
      </div>
    </div>
  )
}

export default DashboardCard
