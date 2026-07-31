import React from 'react'
import { useAdminAuth } from '../context/AdminAuthProvider'
import { Navigate } from 'react-router'

const Protected = ({ children }: { children: React.ReactNode }) => {
    const { loginAdmin, loading } = useAdminAuth()
    if(!loginAdmin || loginAdmin.role !== 'admin') return <Navigate to={'/admin/login'} replace />
  

    if(loading) return <h4>Loading please wait ............</h4>

  return (
      <div>
          {children}
    </div>
  )
}

export default Protected