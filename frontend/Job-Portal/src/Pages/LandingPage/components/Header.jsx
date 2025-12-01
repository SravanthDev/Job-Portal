import React from 'react'
import {motion } from 'framer-motion';
import { Briefcase } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
const Header = () => {
    const isAuthenticated = true;
    const user = {fullName: "Rithwik Kuchana", role: "employer"}
    const navigate = useNavigate();
  return <header>
    <div className=''>
        <div className=''>
            <div className=''>
                <Briefcase className=''/>
        
            </div>
            <span className=''>Job Portal</span>
        </div>
        <nav className=''>
            <a
            onClick={()=> navigate("/find-jobs")}>Find Jobs</a>
            <a
            onClick={()=>{
                navigate(
                    isAuthenticated && user.role === "employer" ? "/employer-dashboard" : "/login"
                )
                className=""
            }}>For Employers</a>
        </nav>
        <div className=''>
    
        </div>
    </div>
  </header>
}

export default Header