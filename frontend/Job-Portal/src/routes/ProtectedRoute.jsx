import React from 'react'
import { Navigate, Outlet, useLocation } from 'react-router-dom'

export const ProtectedRoute = ({ requiredRole, children }) => {

    return <Outlet />;
}
export default ProtectedRoute