import React from 'react'
import "../../Superadmin/Dashboard.css";
import UsersLogo from "../../../assets/people.svg";

export const TotalUsers = ({totalUsers}) => {
   
  return (
      <div className="stat">
        <div className="circle iconcircle">
          <img className='logos-circle' src={UsersLogo} alt="" />
        </div>
        <h3 className='statname'>Total Users</h3>
        <h3 className='statvalue'>{totalUsers}</h3>
      </div>
  )
}
