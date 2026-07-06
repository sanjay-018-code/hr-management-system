import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'

import { login } from '../../services/userServices';

import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import { getCurrentUser } from '../../utils/auth';

const Login = () => {
  const navigate = useNavigate()

  const [formData, setFormData] = useState({
    username:"",
    password:""
  })
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setFormData({
      ...formData, [e.target.name] : e.target.value
    })
  }

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setError("");

    login(formData)
      .then(() => {
        const user = getCurrentUser()
        if (user?.role === "admin") {
          navigate('/admin');
        } else if (user?.role === "hr") {
          navigate('/hr');
        } else if (user?.role === "employee") {
          navigate('/employee');
        }
      })
      .catch((error) => {
        const message = error?.response?.data?.detail || error?.message || 'Login failed';
        setError(message);
      })
      .finally(() => setLoading(false));
  };

  return (
    <section className="flex min-h-screen items-center justify-center">
      <form onSubmit={handleSubmit} className="flex flex-col items-center justify-center w-1/2 rounded shadow signup_form" >
        <h1 className='text-2xl mt-4 font-bold mb-10 text-red-400' >Login</h1>
        <div className='mb-4 w-[80%]'> 
          <TextField onChange={handleChange} name='username' value={formData.username} fullWidth label="Username" type='text' id="fullWidth" size='small' disabled={loading} />
        </div>
        <div className='mb-4 w-[80%]'> 
          <TextField onChange={handleChange}  name='password' value={formData.password} fullWidth label="Password" type='password' id="fullWidth" size='small' disabled={loading} />
        </div>
        {error && <p className='text-red-500 mb-4'>{error}</p>}
        <div className='flex flex-row mb-10 p-5'><Button type='submit' variant="contained" disabled={loading}>{loading ? 'Logging in...' : 'Submit'}</Button></div>
      </form>
    </section>
  )
}

export default Login