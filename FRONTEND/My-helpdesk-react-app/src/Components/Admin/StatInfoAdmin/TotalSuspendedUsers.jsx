import React from 'react'
import "../../Superadmin/Dashboard.css";

export const TotalSuspendedUsers = ({suspendedUsers}) => {
  return (
     <div className="stat">
            <div className="circle iconcircle">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" stroke='#6224FF' class="bi bi-ban" viewBox="0 0 16 16">
                    <path d="M15 8a6.97 6.97 0 0 0-1.71-4.584l-9.874 9.875A7 7 0 0 0 15 8M2.71 12.584l9.874-9.875a7 7 0 0 0-9.874 9.874ZM16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0" />
                </svg>
            </div>
            <h3 className='statname'>suspended</h3>
            <h3 className='statvalue'>{suspendedUsers}</h3>
        </div>
  )
}
