
import React, { useState } from 'react';
import { TopHeader } from '../../TopHeader'
import { LeftHeader } from '../../LeftHeader'

export const ManageUsers = () => {
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
