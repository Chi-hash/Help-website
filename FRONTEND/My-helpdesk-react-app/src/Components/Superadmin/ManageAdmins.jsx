import React from 'react';
import { LeftHeader } from '../../LeftHeader'
import { TopHeader } from '../../TopHeader'
import { ManageAdminstat } from './ManageAdminstat';


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
