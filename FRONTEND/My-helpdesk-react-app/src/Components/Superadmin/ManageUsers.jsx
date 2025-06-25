import React from 'react';
import { TopHeader } from '../../TopHeader'
import { LeftHeader } from '../../LeftHeader'
import { ManageUserstat } from './ManageUserstat';
import { ManageUsersSearchList } from './ManageUsersSearchList';

export const ManageUsers = () => {
    return (
        <section id="dashboardsection">
            <div className="left">
                <LeftHeader />
            </div>
            <div className="right">
                <TopHeader />
               <ManageUserstat/>
               <ManageUsersSearchList/>
            </div>
        </section>
    );
}
