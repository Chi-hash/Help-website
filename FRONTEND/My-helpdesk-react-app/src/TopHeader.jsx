import React from 'react'

export const TopHeader = () => {
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  return (
    <div className="topheader-div">
        <div className="left">
          <h2>Welcome {user.firstname},</h2>
        </div>
        <div className="right">
          {user.role === "superAdmin" &&(
            <p>Super Admin</p>
          )}
          {user.role === "admin" &&(
            <p> Admin</p>
          )}
          {user.role === "staff" &&(
            <p>Staff</p>
          )}
          {user.role === "it" &&(
            <p>IT staff</p>
          )}
          <div className='blank-profile'></div>
        </div>
    </div>
  )
}
