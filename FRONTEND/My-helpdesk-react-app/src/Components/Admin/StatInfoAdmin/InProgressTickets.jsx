import React from 'react'
import "../../Superadmin/Dashboard.css";

export const InProgressTickets = ({inProgressTickets}) => {
    return (
        <div className="stat">
            <div className="circle iconcircle">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" stroke='#6224FF' class="bi bi-opencollective" viewBox="0 0 16 16">
                    <path fill-opacity=".4" d="M12.995 8.195c0 .937-.312 1.912-.78 2.693l1.99 1.99c.976-1.327 1.6-2.966 1.6-4.683 0-1.795-.624-3.434-1.561-4.76l-2.068 2.028c.468.781.78 1.679.78 2.732z" />
                    <path d="M8 13.151a4.995 4.995 0 1 1 0-9.99c1.015 0 1.951.273 2.732.82l1.95-2.03a7.805 7.805 0 1 0 .04 12.449l-1.951-2.03a5.07 5.07 0 0 1-2.732.781z" />
                </svg>
            </div>
            <h3 className='statname'>In Progress</h3>
            <h3 className='statvalue'>{inProgressTickets}</h3>
        </div>
    )
}
