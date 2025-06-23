import React from 'react';
import { LeftHeader } from '../../LeftHeader'
import { TopHeader } from '../../TopHeader'
import { ManageAdminstat } from './ManageAdminstat';
import { NotificationBottom } from './NotificationBottom';


export const ManageAdmins = () => {
    
    return (
        <section id="dashboardsection">
            <div className="left">
                <LeftHeader />
            </div>
            <div className="right">
                <TopHeader />
                <ManageAdminstat/>
                
               
            </div>
        </section>
    );
}
