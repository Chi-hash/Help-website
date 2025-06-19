import React, { useState } from 'react';
import { LeftHeader } from '../../LeftHeader'
import { TopHeader } from '../../TopHeader'

export const TicketNotes = () => {
   const [isSidebarOpen, setIsSidebarOpen] = useState(true);

    const toggleSidebar = () => {
        setIsSidebarOpen(!isSidebarOpen);
    };

    return (
        <section id="dashboardsection" className={isSidebarOpen ? '' : 'sidebar-collapsed'}>
            <div className="left">
                <LeftHeader isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />
            </div>
            <div className="right">
                <TopHeader />
                {/* Add your main content here */}
            </div>
        </section>
    );
}
