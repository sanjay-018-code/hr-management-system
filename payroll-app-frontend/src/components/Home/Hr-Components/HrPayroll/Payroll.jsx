import React, { useEffect, useState } from 'react'
import { getAllPayroll, generatePayroll, getEmployeePayroll } from '../../../../services/payrollSeervices'
import { get_all_employees } from '../../../../services/employeeServices'

const Payroll = ({ workspaceLabel = 'HR Workspace' }) => {
  const [employees, setEmployees] = useState([])
  const [payrolls, setPayrolls] = useState([])
  const [selectedMonth, setSelectedMonth] = useState(new Date().toISOString().slice(0, 7))
  const [selectedEmployee, setSelectedEmployee] = useState(null)
  const [selectedEmployeePayrolls, setSelectedEmployeePayrolls] = useState([])
  const [loadingEmployeeId, setLoadingEmployeeId] = useState(null)
  const [bulkLoading, setBulkLoading] = useState(false)
  const [message, setMessage] = useState(null)
  const [error, setError] = useState(null)

  const parseMonthKey = (monthKey) => {
    const [year, month] = monthKey.split('-')
    return {
      year: Number(year) || new Date().getFullYear(),
      month: Number(month) || new Date().getMonth() + 1,
    }
  }

  const fetchPayroll = async () => {
    try {
      const data = await getAllPayroll()
      setPayrolls(Array.isArray(data) ? data : [])
    } catch (err) {
      setError(err.message || 'Failed to load payrolls')
    }
  }

  const fetchEmployees = async () => {
    try {
      const data = await get_all_employees(1, 50, '', 'name', 'asc')
      setEmployees(data?.employees ?? [])
    } catch (err) {
      setError(err.message || 'Failed to load employees')
    }
  }

  useEffect(() => {
    fetchPayroll()
    fetchEmployees()
  }, [])

  const handleSelectEmployee = async (employee) => {
    setSelectedEmployee(employee)
    setError(null)
    try {
      const payrollData = await getEmployeePayroll(employee.id)
      setSelectedEmployeePayrolls(Array.isArray(payrollData) ? payrollData : [])
      setMessage(null)
    } catch (err) {
      setSelectedEmployeePayrolls([])
      setError(err.message || 'Failed to load employee payrolls')
    }
  }

  const handleGeneratePayroll = async (employee) => {
    const { month, year } = parseMonthKey(selectedMonth)
    setLoadingEmployeeId(employee.id)
    setError(null)
    setMessage(null)

    try {
      await generatePayroll(employee.id, month, year)
      await fetchPayroll()
      if (selectedEmployee?.id === employee.id) {
        await handleSelectEmployee(employee)
      }
      setMessage(`Payroll generated for ${employee.name}`)
    } catch (err) {
      const detail = err?.response?.data?.detail || err.message || 'Failed to generate payroll'
      setError(detail)
    } finally {
      setLoadingEmployeeId(null)
    }
  }

  const handleGeneratePayrollForAll = async () => {
    const { month, year } = parseMonthKey(selectedMonth)
    setBulkLoading(true)
    setError(null)
    setMessage(null)

    try {
      const results = await Promise.allSettled(
        employees.map((employee) => generatePayroll(employee.id, month, year))
      )
      const successes = results.filter((item) => item.status === 'fulfilled').length
      const failures = results.filter((item) => item.status === 'rejected')
      await fetchPayroll()
      if (selectedEmployee) {
        await handleSelectEmployee(selectedEmployee)
      }
      setMessage(`Payroll generated for ${successes} employee(s).`)
      if (failures.length) {
        setError(failures[0]?.reason?.response?.data?.detail || failures[0]?.reason?.message || 'Some payrolls could not be generated')
      }
    } catch (err) {
      setError(err.message || 'Failed to generate payroll for all employees')
    } finally {
      setBulkLoading(false)
    }
  }

  const selectedMonthParsed = parseMonthKey(selectedMonth)
  const payrollsForMonth = payrolls.filter(
    (payroll) => payroll.month === selectedMonthParsed.month && payroll.year === selectedMonthParsed.year
  )

  return (
    <main className='min-h-screen bg-slate-100 p-4 text-slate-900 md:p-8'>
      <div className='mx-auto max-w-7xl'>
        <div className='mb-6'>
          <p className='text-sm font-semibold uppercase tracking-wide text-slate-500'>{workspaceLabel}</p>
          <h1 className='text-3xl font-bold'>Payroll</h1>
          <p className='mt-2 text-lg text-slate-700'>Generate payroll for each employee and view payrolls by employee.</p>
        </div>

        {error && <p className='mb-4 rounded border border-red-200 bg-red-50 p-3 text-sm text-red-700'>{String(error)}</p>}
        {message && <p className='mb-4 rounded border border-emerald-200 bg-emerald-50 p-3 text-sm text-emerald-700'>{String(message)}</p>}

        <section className='grid gap-6 xl:grid-cols-[1.6fr_1fr]'>
          <div className='rounded-lg border border-slate-200 bg-white p-6 shadow-sm'>
            <div className='mb-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between'>
              <div>
                <h2 className='text-2xl font-bold text-slate-900'>Employees</h2>
                <p className='text-sm text-slate-500'>Click an employee card to view payroll history.</p>
              </div>
              <div className='flex flex-col gap-3 sm:flex-row sm:items-center'>
                <label className='flex flex-col text-sm font-semibold text-slate-700'>Payroll month
                  <input
                    type='month'
                    value={selectedMonth}
                    onChange={(e) => setSelectedMonth(e.target.value)}
                    className='mt-1 h-11 rounded border border-slate-300 bg-white p-2 outline-none focus:border-slate-700'
                  />
                </label>
                <button
                  type='button'
                  onClick={handleGeneratePayrollForAll}
                  disabled={bulkLoading || employees.length === 0}
                  className='h-11 rounded bg-slate-800 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-700 disabled:cursor-not-allowed disabled:bg-slate-400'
                >
                  {bulkLoading ? 'Generating...' : 'Generate payroll for all'}
                </button>
              </div>
            </div>

            <div className='mb-6 rounded-lg border border-slate-200 bg-slate-50 p-4'>
              <h3 className='text-lg font-semibold text-slate-900'>Summary for {new Date(`${selectedMonth}-01`).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}</h3>
              <div className='mt-3 grid gap-3 sm:grid-cols-3'>
                <div className='rounded border border-slate-200 bg-white p-3'>
                  <p className='text-sm uppercase tracking-wide text-slate-500'>Employees</p>
                  <p className='mt-2 text-2xl font-bold text-slate-900'>{employees.length}</p>
                </div>
                <div className='rounded border border-slate-200 bg-white p-3'>
                  <p className='text-sm uppercase tracking-wide text-slate-500'>Payroll records</p>
                  <p className='mt-2 text-2xl font-bold text-slate-900'>{payrollsForMonth.length}</p>
                </div>
                <div className='rounded border border-slate-200 bg-white p-3'>
                  <p className='text-sm uppercase tracking-wide text-slate-500'>Pending</p>
                  <p className='mt-2 text-2xl font-bold text-slate-900'>{Math.max(employees.length - payrollsForMonth.length, 0)}</p>
                </div>
              </div>
            </div>

            <div className='grid gap-4'>
              {employees.map((employee) => {
                const existingPayroll = payrollsForMonth.find((payroll) => payroll.employee_id === employee.id)
                return (
                  <div
                    key={employee.id}
                    onClick={() => handleSelectEmployee(employee)}
                    className={`cursor-pointer rounded-lg border p-5 transition-colors ${selectedEmployee?.id === employee.id ? 'border-slate-700 bg-slate-50' : 'border-slate-200 bg-white hover:bg-slate-50'}`}
                  >
                    <div className='flex flex-col gap-3 md:flex-row md:items-center md:justify-between'>
                      <div>
                        <h3 className='text-xl font-bold uppercase text-slate-900'>{employee.name}</h3>
                        <p className='text-sm uppercase text-slate-600'>{employee.designation} • {employee.department}</p>
                        <p className='mt-2 text-sm text-slate-500'>{employee.email} • {employee.phone}</p>
                      </div>
                      <div className='flex flex-col items-start gap-2 sm:items-end'>
                        <span className='text-sm text-slate-500'>Salary: <span className='font-semibold text-slate-900'>Rs. {employee.salary}</span></span>
                        <button
                          type='button'
                          onClick={(event) => { event.stopPropagation(); handleGeneratePayroll(employee) }}
                          disabled={loadingEmployeeId === employee.id || Boolean(existingPayroll)}
                          className='h-10 rounded bg-slate-800 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-700 disabled:cursor-not-allowed disabled:bg-slate-400'
                        >
                          {existingPayroll ? 'Payroll generated' : loadingEmployeeId === employee.id ? 'Generating...' : 'Generate payroll'}
                        </button>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>

          <div className='rounded-lg border border-slate-200 bg-white p-6 shadow-sm'>
            <div className='mb-6'>
              <h2 className='text-2xl font-bold text-slate-900'>Employee Payroll Details</h2>
              <p className='text-sm text-slate-500'>Select an employee to inspect payroll history.</p>
            </div>

            {!selectedEmployee && (
              <div className='rounded-lg border border-dashed border-slate-300 bg-slate-50 p-6 text-center text-slate-600'>
                Select an employee to view payroll details.
              </div>
            )}

            {selectedEmployee && (
              <div className='space-y-6'>
                <div className='rounded-lg border border-slate-200 bg-slate-50 p-4'>
                  <h3 className='text-xl font-bold text-slate-900'>{selectedEmployee.name}</h3>
                  <p className='text-sm uppercase text-slate-500'>{selectedEmployee.designation} • {selectedEmployee.department}</p>
                  <div className='mt-3 grid gap-3 sm:grid-cols-2'>
                    <div>
                      <p className='text-sm uppercase tracking-wide text-slate-500'>Salary</p>
                      <p className='mt-1 text-lg font-semibold text-slate-900'>Rs. {selectedEmployee.salary}</p>
                    </div>
                    <div>
                      <p className='text-sm uppercase tracking-wide text-slate-500'>Contact</p>
                      <p className='mt-1 text-sm text-slate-900'>{selectedEmployee.email}</p>
                      <p className='text-sm text-slate-900'>{selectedEmployee.phone}</p>
                    </div>
                  </div>
                </div>

                <div className='rounded-lg border border-slate-200 bg-white p-4'>
                  <h3 className='mb-4 text-lg font-bold text-slate-900'>Payroll History</h3>
                  {selectedEmployeePayrolls.length === 0 && (
                    <p className='text-sm text-slate-600'>No payroll records found for this employee yet.</p>
                  )}
                  {selectedEmployeePayrolls.length > 0 && (
                    <div className='space-y-3'>
                      {selectedEmployeePayrolls.map((payroll) => (
                        <div key={payroll.id} className='rounded border border-slate-200 bg-slate-50 p-4'>
                          <div className='flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between'>
                            <div>
                              <p className='text-sm uppercase tracking-wide text-slate-500'>Period</p>
                              <p className='text-lg font-semibold text-slate-900'>{new Date(`${String(payroll.year).padStart(4, '0')}-${String(payroll.month).padStart(2, '0')}-01`).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}</p>
                            </div>
                            <div className='text-right'>
                              <p className='text-sm uppercase tracking-wide text-slate-500'>Net pay</p>
                              <p className='text-lg font-semibold text-slate-900'>Rs. {payroll.final}</p>
                            </div>
                          </div>
                          <div className='mt-4 grid gap-3 sm:grid-cols-2'>
                            <div className='rounded-lg border border-slate-200 bg-white p-3'>
                              <p className='text-xs uppercase tracking-wide text-slate-500'>Base salary</p>
                              <p className='mt-1 text-sm font-semibold text-slate-900'>Rs. {payroll.base_salary}</p>
                            </div>
                            <div className='rounded-lg border border-slate-200 bg-white p-3'>
                              <p className='text-xs uppercase tracking-wide text-slate-500'>Overtime / adjustment</p>
                              <p className='mt-1 text-sm font-semibold text-slate-900'>Rs. {payroll.ot_amount}</p>
                            </div>
                            <div className='rounded-lg border border-slate-200 bg-white p-3'>
                              <p className='text-xs uppercase tracking-wide text-slate-500'>Deduction</p>
                              <p className='mt-1 text-sm font-semibold text-slate-900'>Rs. {payroll.deduction}</p>
                            </div>
                            <div className='rounded-lg border border-slate-200 bg-white p-3'>
                              <p className='text-xs uppercase tracking-wide text-slate-500'>Present days</p>
                              <p className='mt-1 text-sm font-semibold text-slate-900'>{payroll.present_days}</p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </section>
      </div>
    </main>
  )
}

export default Payroll
