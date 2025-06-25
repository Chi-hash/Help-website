import React from 'react'
import closedTicketicon from "../../assets/closed-ticket.svg"

export const ClosedTickets = ({ closedTickets }) => {
    return (
        <div className="stat">
            <div className="circle iconcircle">
                <img src={closedTicketicon} alt="" />
            </div>
            <h3 className='statname'>Closed</h3>
            <h3 className='statvalue'>{closedTickets}</h3>
        </div>
    )
}
