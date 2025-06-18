import React, { useState } from 'react';
import logo from "../../My-helpdesk-react-app/src/assets/HELPLOGO.svg"
import { NavLink, useLocation } from 'react-router-dom';

export const LeftHeader = () => {
    const [ticketDropdownOpen, setTicketDropdownOpen] = useState(false);
    const location = useLocation();

    // Check if a subroute is active
    const isTicketSubRouteActive = location.pathname.startsWith('/manage-tickets');

    return (
        <div className='header-div'>
            <img src={logo} alt="Help Desk Logo" style={{ width: "150px" }} />

            <div className="navs">
                <NavLink className="leftheadernav" to={"/super-admin-dashboard"}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-layout-text-window-reverse" viewBox="0 0 16 16">
                        <path d="M13 6.5a.5.5 0 0 0-.5-.5h-5a.5.5 0 0 0 0 1h5a.5.5 0 0 0 .5-.5m0 3a.5.5 0 0 0-.5-.5h-5a.5.5 0 0 0 0 1h5a.5.5 0 0 0 .5-.5m-.5 2.5a.5.5 0 0 1 0 1h-5a.5.5 0 0 1 0-1z" />
                        <path d="M14 0a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V2a2 2 0 0 1 2-2zM2 1a1 1 0 0 0-1 1v1h14V2a1 1 0 0 0-1-1zM1 4v10a1 1 0 0 0 1 1h2V4zm4 0v11h9a1 1 0 0 0 1-1V4z" />
                    </svg>
                    <p>Dashboard</p>
                </NavLink>

                <NavLink className="leftheadernav" to={"/manage-admins"}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-people" viewBox="0 0 16 16">
                        <path d="M15 14s1 0 1-1-1-4-5-4-5 3-5 4 1 1 1 1zM7.022 13L7 12.996c.001-.264.167-1.03.76-1.72C8.312 10.629 9.282 10 11 10c1.717 0 2.687.63 3.24 1.276.593.69.758 1.457.76 1.72l-.008.002-.014.002zM11 7a2 2 0 1 0 0-4 2 2 0 0 0 0 4zM14 5a3 3 0 1 1-6 0 3 3 0 0 1 6 0z" />
                    </svg>
                    <p>Manage Admins</p>
                </NavLink>

                <NavLink className="leftheadernav" to={"/manage-users"}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-people" viewBox="0 0 16 16">
                        <path d="M15 14s1 0 1-1-1-4-5-4-5 3-5 4 1 1 1 1zM7.022 13L7 12.996c.001-.264.167-1.03.76-1.72C8.312 10.629 9.282 10 11 10c1.717 0 2.687.63 3.24 1.276.593.69.758 1.457.76 1.72l-.008.002-.014.002zM11 7a2 2 0 1 0 0-4 2 2 0 0 0 0 4zM14 5a3 3 0 1 1-6 0 3 3 0 0 1 6 0z" />
                    </svg>
                    <p>Manage Users</p>
                </NavLink>

                <div
                    className={`leftheadernav ${isTicketSubRouteActive ? 'active' : ''}`}
                    onClick={() => setTicketDropdownOpen(!ticketDropdownOpen)}
                >
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-ticket-detailed" viewBox="0 0 16 16">
                        <path d="M4 5.5a.5.5 0 0 1 .5-.5h7a.5.5 0 0 1 0 1h-7a.5.5 0 0 1-.5-.5m0 5a.5.5 0 0 1 .5-.5h7a.5.5 0 0 1 0 1h-7a.5.5 0 0 1-.5-.5M5 7a1 1 0 0 0 0 2h6a1 1 0 1 0 0-2z" />
                        <path d="M0 4.5A1.5 1.5 0 0 1 1.5 3h13A1.5 1.5 0 0 1 16 4.5V6a.5.5 0 0 1-.5.5 1.5 1.5 0 0 0 0 3 .5.5 0 0 1 .5.5v1.5a1.5 1.5 0 0 1-1.5 1.5h-13A1.5 1.5 0 0 1 0 11.5V10a.5.5 0 0 1 .5-.5 1.5 1.5 0 1 0 0-3A.5.5 0 0 1 0 6z" />
                    </svg>
                    <p>Manage Tickets</p>
                    <span className={`arrow ${ticketDropdownOpen ? 'rotate' : ''}`}>▼</span>
                </div>

                <ul className={`ticket-dropdown ${ticketDropdownOpen ? 'open' : ''}`}>
                    <li><NavLink to="/manage-tickets/my-tickets">My Tickets</NavLink></li>
                    <li><NavLink to="/manage-tickets/all-tickets">All Tickets</NavLink></li>
                    <li><NavLink to="/manage-tickets/ticket-notes">Ticket Notes</NavLink></li>
                </ul>
            </div>
        </div>
    );
};
