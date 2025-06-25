import React from 'react'
import "../Superadmin/Dashboard.css"
import closedTicketicon from "../../assets/closed-ticket.svg"

export const MyClosedTickets = ({ myClosedTickets }) => {
    return (
        <div className="stat">
            <div className="circle iconcircle">
                <img src={closedTicketicon} alt="" />
            </div>
            <h3 className='statname'>Closed</h3>
            <h3 className='statvalue'>{myClosedTickets}</h3>
        </div>
    )
} 