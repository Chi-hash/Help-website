import React from 'react'
import resolvedticketicon from "../../assets/resolved-icon.svg"
import "../../Superadmin/Dashboard.css";

export const ResolvedTickets = ({ resolvedTickets }) => {
    return (
        <div className="stat">
            <div className="circle iconcircle">
                <img src={resolvedticketicon} alt="" />
            </div>
            <h3 className='statname'>Resolved</h3>
            <h3 className='statvalue'>{resolvedTickets}</h3>
        </div>
    )
}
