import React from 'react'
import activeLogo from "../../assets/check-circle.svg"

export const TotalActiveAdmins = ({activeAdmins}) => {
  return (
    <div className="stat">
            <div className="circle iconcircle">
                <img src={activeLogo} alt="" />
            </div>
            <h3 className='statname'>Active</h3>
            <h3 className='statvalue'>{activeAdmins}</h3>
        </div>
  )
}
