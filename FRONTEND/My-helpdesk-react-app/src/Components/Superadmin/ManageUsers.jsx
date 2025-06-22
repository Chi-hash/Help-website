import React from 'react';
import { TopHeader } from '../../TopHeader'
import { LeftHeader } from '../../LeftHeader'
import { ManageUserstat } from './ManageUserstat';

export const ManageUsers = () => {
    return (
        <section id="dashboardsection">
            <div className="left">
                <LeftHeader />
            </div>
            <div className="right">
                <TopHeader />
               <ManageUserstat/>
            </div>
        </section>
    );
}
