import React from 'react'
import { TotalTickets } from '../StatInfo/TotalTickets';
import { useEffect, useState } from 'react'
import { getAuthToken, handleAuthError } from '../../utils/auth.js';
import { ClosedTickets } from '../StatInfo/ClosedTickets.jsx';
import { InProgressTickets } from '../StatInfo/InProgressTickets.jsx';
import { OpenTickets } from '../StatInfo/OpenTickets.jsx';
import { ResolvedTickets } from '../StatInfo/ResolvedTickets.jsx';

export const AllTicketstat = () => {
    const [stats, setStats] = useState(null);

    const token = getAuthToken();

    useEffect(() => {
        const fetchStats = async () => {
            try {
                if (!token) {
                    return;
                }

                const res = await fetch("/api/superadmin/superAdmin-Dashboard", {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });

                if (handleAuthError(res)) {
                    return; // Auth error was handled
                }

                const data = await res.json();
                if (data.success) {
                    setStats(data.data);
                }
            } catch (err) {
                // Handle error
            }
        };

        fetchStats();
    }, [token]);

    if (!stats) return <p>Loading stats...</p>;
    return (
        <div className="allstats">
            <TotalTickets totalTickets={stats.totalTickets} />
            <OpenTickets openTickets={stats.openTickets} />
            <InProgressTickets inProgressTickets={stats.inProgressTickets} />
            <ResolvedTickets resolvedTickets={stats.resolvedTickets} />
            <ClosedTickets closedTickets={stats.closedTickets} />


        </div>
    )
}
