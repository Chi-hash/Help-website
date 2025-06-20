import React from 'react';
import {LeftHeader} from "../../LeftHeader";
import { TopHeader } from '../../TopHeader';

export const StaffDashboard = () => {
    return (
        <section id="dashboardsection">
            <div className="left">
                <LeftHeader />
            </div>
            <div className="right">
                <TopHeader />
                {/* Add your main content here */}
            </div>
        </section>
    );
}
