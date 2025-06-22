import React from 'react'
import "../Superadmin/Dashboard.css"
import openticketicon from "../../assets/open-ticket.svg"

export const MyOpenTickets = ({ myOpenTickets }) => {
    return (
        <div className="stat">
            <div className="circle iconcircle">
                <img src={openticketicon} alt="" />
            </div>
            <h3 className='statname'>Open</h3>
            <h3 className='statvalue'>{myOpenTickets}</h3>
        </div>
    )
} 