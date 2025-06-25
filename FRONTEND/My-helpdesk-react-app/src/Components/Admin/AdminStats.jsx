import React from 'react'
import { useEffect, useState } from 'react'
import { TotalUsers } from './StatInfo_Admin/TotalTickets.js' ;
import { TotalDepartments } from './StatInfo_Admin/TotalDepartments.js';
import { getAuthToken, handleAuthError } from '../../utils/auth.js';
import { TotalTickets } from './StatInfo_Admin/TotalTickets.js';

export const AdminStats = () => {

    const [stats, setStats] = useState(null);

    const token = getAuthToken();

    useEffect(() => {
        const fetchStats = async () => {
            try {
                if (!token) {
                    return;
                }

                const res = await fetch("/api/admin/admin-Dashboard", {
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
                // Handle error silently
            }
        };

        fetchStats();
    }, [token]);

    if (!stats) return <p>Loading stats...</p>;


    return (
        <div className="allstats">
            <TotalUsers totalUsers={stats.totalUsers} />
            <TotalDepartments totalDepartments={stats.totalDepartments} />
            <TotalTickets totalTickets={stats.totalTickets} />
        </div>
    )
}
