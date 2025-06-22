import React from 'react';
import { TopHeader } from '../../TopHeader'
import { LeftHeader } from '../../LeftHeader'
import { MyTicketStats } from './MyTicketStats';

export const MyTickets = () => {
    return (
        <section id="dashboardsection">
            <div className="left">
                <LeftHeader />
            </div>
            <div className="right">
                <TopHeader />
                <MyTicketStats />
            </div>
        </section>
    );
}
