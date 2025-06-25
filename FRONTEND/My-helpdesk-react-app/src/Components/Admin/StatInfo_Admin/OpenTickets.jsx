import React from 'react'
import openticketicon from "../../assets/open-ticket.svg"

export const OpenTickets = ({openTickets}) => {
  return (
       <div className="stat">
            <div className="circle iconcircle">
               <img src={openticketicon} alt="" />
            </div>
            <h3 className='statname'>Open</h3>
            <h3 className='statvalue'>{openTickets}</h3>
        </div>
  )
}
