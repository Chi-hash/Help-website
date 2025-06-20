import React from 'react'
import "../Superadmin/Dashboard.css"
import DepartmentLogo from "../../assets/buildings.svg"

export const TotalDepartments = ({totalDepartments}) => {
  return (
   <div className="stat">
       <div className="circle iconcircle">
        <img src={DepartmentLogo} alt="" />
       </div>
        <h3 className='statname'>Total Departments</h3>
        <h3 className='statvalue'>{totalDepartments}</h3>
    </div>
  )
}
