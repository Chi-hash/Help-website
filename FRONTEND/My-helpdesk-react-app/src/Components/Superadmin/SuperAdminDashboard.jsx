import React from 'react';
import {LeftHeader} from "../../LeftHeader";
import { TopHeader } from '../../TopHeader';
import { Stats } from './Stats';
import { NotificationBottom } from './NotificationBottom';




export const SuperAdminDashboard = () => {
    return (
        <section id="dashboardsection">
            <div className="left">
                <LeftHeader />
            </div>
            <div className="right">
               <div className="testdiv">
                 <TopHeader />
               </div>
               <div className="statss">
                 <Stats/>
               </div>
                <NotificationBottom/>
                
                

            </div>
        </section>
    );
}
