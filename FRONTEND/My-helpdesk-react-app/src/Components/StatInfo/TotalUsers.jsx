import React from 'react'

export const TotalUsers = ({totalUsers}) => {
   
  return (
      <div className="stat">
        <div className="circle iconcircle"></div>
        <h3>Total Users</h3>
        <h3>{totalUsers}</h3>
      </div>
  )
}
