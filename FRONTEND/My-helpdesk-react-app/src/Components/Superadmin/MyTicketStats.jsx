import React from 'react'
import { useEffect, useState } from 'react'
import { getAuthToken, handleAuthError } from '../../utils/auth.js';
import { MyOpenTickets } from '../StatInfo/MyOpenTickets';
import { MyClosedTickets } from '../StatInfo/MyClosedTickets';
import { MyInProgressTickets } from '../StatInfo/MyInProgressTickets';
import { MyResolvedTickets } from '../StatInfo/MyResolvedTickets';

export const MyTicketStats = () => {
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);

    const token = getAuthToken();

    useEffect(() => {
        const fetchMyTicketStats = async () => {
            try {
                if (!token) {
                    return;
                }

                const res = await fetch("/api/tickets/my-stats", {
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
                console.error('Error fetching my ticket stats:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchMyTicketStats();
    }, [token]);

    if (loading) return <p>Loading your ticket stats...</p>;
    if (!stats) return <p>No ticket data available.</p>;

    return (
        <>
            <div className="allstats">
                <MyOpenTickets myOpenTickets={stats.myOpenTickets} />
                <MyInProgressTickets myInProgressTickets={stats.myInProgressTickets} />
                <MyResolvedTickets myResolvedTickets={stats.myResolvedTickets} />
                <MyClosedTickets myClosedTickets={stats.myClosedTickets} />
            </div>
        </>
    );
}; 