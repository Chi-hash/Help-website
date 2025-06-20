import React from 'react'
import "../Superadmin/Dashboard.css"
import AdminsLogo from "../../assets/shield-check.svg"

export const TotalAdmins = ({totalAdmins}) => {
  return (
    <div className="stat">
       <div className="circle iconcircle">
        <img className='logos-circle' src={AdminsLogo} alt="" />
       </div>
        <h3 className='statname'>Total Admins</h3>
        <h3 className='statvalue'>{totalAdmins}</h3>
    </div>
  )
}
