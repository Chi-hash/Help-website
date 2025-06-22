import React from 'react';
import { LeftHeader } from '../../LeftHeader'
import { TopHeader } from '../../TopHeader'
import { AllTicketstat } from './AllTicketstat';

export const AllTickets = () => {
    return (
        <section id="dashboardsection">
            <div className="left">
                <LeftHeader />
            </div>
            <div className="right">
                <TopHeader />
                <AllTicketstat/>
            </div>
        </section>
    );
}
