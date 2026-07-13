import { Routes, Route } from "react-router-dom"

import ProtectedRoute from "./ProtectedRoute"
import Login from "../login/Login"

import Hr from "../Home/Hr"
import EmployeeList from "../Home/Hr-Components/Hr-employee/EmployeeList"
import Attendance from './../Home/Hr-Components/HrAttendance/Attendance';
import Departments from "../Home/Hr-Components/HrDepartments/Departments"
import HrLeave from "../Home/Hr-Components/HrLeave/HrLeave"

import Admin from "../Home/Admin"

import Employee from "../Home/Employee"


const Routing = () => {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/admin" element={<ProtectedRoute allowedRoles={["admin"]}> <Admin /> </ProtectedRoute>} />

      <Route path="/hr" element={<ProtectedRoute allowedRoles={["hr"]}> <Hr /> </ProtectedRoute>} />
      <Route path="/hr/employees" element={<ProtectedRoute allowedRoles={["hr"]}><EmployeeList/> </ProtectedRoute>} />
      <Route path="/hr/departments" element={<ProtectedRoute allowedRoles={["hr"]}><Departments/> </ProtectedRoute>} />
      <Route path="/hr/attendance" element={<ProtectedRoute allowedRoles={["hr"]}><Attendance/> </ProtectedRoute>} />
      <Route path="/hr/leave" element={<ProtectedRoute allowedRoles={["hr"]}><HrLeave/> </ProtectedRoute>}/>

      <Route path="/employee" element={<ProtectedRoute allowedRoles={["employee"]}> <Employee /> </ProtectedRoute>} />

    </Routes>
  )
}

export default Routing