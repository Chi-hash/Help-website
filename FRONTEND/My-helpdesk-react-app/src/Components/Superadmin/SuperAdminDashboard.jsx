import React, { useState } from 'react';
import {LeftHeader} from "../../LeftHeader";
import { TopHeader } from '../../TopHeader';
import { TotalAdmins } from '../StatInfo/TotalAdmins';
import { TotalDepartments } from '../StatInfo/TotalDepartments';
import { TotalTickets } from '../StatInfo/TotalTickets';
import { TotalUsers } from '../StatInfo/TotalUsers';
import { Stats } from './Stats';




export const SuperAdminDashboard = () => {
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
                <Stats/>
                

            </div>
        </section>
    );
}
