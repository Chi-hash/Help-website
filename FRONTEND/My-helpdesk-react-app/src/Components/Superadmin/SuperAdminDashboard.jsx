import React from 'react';
import {LeftHeader} from "../../LeftHeader";
import { TopHeader } from '../../TopHeader';
import { TotalAdmins } from '../StatInfo/TotalAdmins';
import { TotalDepartments } from '../StatInfo/TotalDepartments';
import { TotalTickets } from '../StatInfo/TotalTickets';
import { TotalUsers } from '../StatInfo/TotalUsers';
import { Stats } from './Stats';




export const SuperAdminDashboard = () => {
    return (
        <section id="dashboardsection">
            <div className="left">
                <LeftHeader />
            </div>
            <div className="right">
                <TopHeader />
                <Stats/>
                

            </div>
        </section>
    );
}
