import React from 'react'

const DashboardCard = ({ data }) => {
  const safeData = data ?? {}
  const cards = [
    { key: 'total_employees', label: 'Total Employees', value: safeData.total_employees ?? 0 },
    { key: 'total_departments', label: 'Total Departments', value: safeData.total_departments ?? 0 },
    { key: 'present_today', label: 'Present Today', value: safeData.present_today ?? 0 },
    { key: 'absent_today', label: 'Absent Today', value: safeData.absent_today ?? 0 }
  ]

  return (
    <div className='flex flex-wrap items-center justify-around gap-4 m-7'>
      {data && cards.map((card) => (
        <div key={card.key} className='flex flex-col justify-between w-[22%] min-w-[180px] h-50 p-5 rounded shadow bg-[#f78889]'>
          <h2 className='flex text-3xl text-center font-bold justify-center'>{card.label}</h2>
          <h2 className='flex text-3xl font-bold justify-center mt-2'>{card.value}</h2>
        </div>
      ))
    }
    {data && 
    <div className='flex flex-wrap items-center justify-between m-4 w-[100%] h-28 rounded shadow bg-[#f78889]'>
        <h2 className='flex text-3xl m-3 text-center font-bold '>Pending Leave </h2>
        <h2 className='flex text-3xl m-3 font-bold ml-2'>{safeData.pending_leaves}</h2>
    </div>
    }
    </div>
  )
}

export default DashboardCard