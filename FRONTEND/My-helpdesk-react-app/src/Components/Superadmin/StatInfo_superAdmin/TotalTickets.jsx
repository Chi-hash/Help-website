import React from 'react'
import "../Superadmin/Dashboard.css"
import  TicketLogo from "../../assets/ticket-perforated.svg"

export const TotalTickets = ({totalTickets}) => {
  return (
   <div className="stat">
       <div className="circle iconcircle">
        <img className='logos-circle' src={TicketLogo} alt="" />
       </div>
        <h3 className='statname'>Total Tickets</h3>
        <h3 className='statvalue'>{totalTickets}</h3>
    </div>
  )
}
