import { Routes,Route } from "react-router-dom"

import Login from "../login/Login"
import Admin from "../Home/Admin"
import Hr from "../Home/Hr"
import Employee from "../Home/Employee"
import ProtectedRoute from "./ProtectedRoute"

const Routing = () => {
  return (
    <Routes>
        <Route path="/" element = {<Login/>} />
        <Route path="/admin" element = {<ProtectedRoute allowedRoles={["admin"]}> <Admin/> </ProtectedRoute>} />
        <Route path="/hr" element = {<ProtectedRoute allowedRoles={["hr"]}> <Hr/> </ProtectedRoute>} />
        <Route path="/employee" element = {<ProtectedRoute allowedRoles={["employee"]}> <Employee/> </ProtectedRoute>} />
    </Routes>
  )
}

export default Routing