import React from 'react'
import "../Superadmin/Dashboard.css"
import resolvedticketicon from "../../assets/resolved-icon.svg"
export const MyResolvedTickets = ({ myResolvedTickets }) => {
    return (
        <div className="stat">
            <div className="circle iconcircle">
                <img src={resolvedticketicon} alt="" />
            </div>
            <h3 className='statname'>Resolved</h3>
            <h3 className='statvalue'>{myResolvedTickets}</h3>
        </div>
    )
} 