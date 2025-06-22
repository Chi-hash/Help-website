import React from 'react'
import { useEffect, useState } from 'react'
import { getAuthToken, handleAuthError } from '../../utils/auth.js';
import { TotalUsers } from '../StatInfo/TotalUsers';
import { TotalSuspendedUsers } from '../StatInfo/TotalSuspendedUsers.jsx';
import { TotalActiveUsers } from '../StatInfo/TotalActiveUsers.jsx';

export const ManageUserstat = () => {

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
                    return; 
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
        <>
          <div className="allstats">
            <TotalUsers totalUsers={stats.totalUsers}/>
            <TotalSuspendedUsers suspendedUsers={stats.suspendedUsers}/>
            <TotalActiveUsers activeUsers={stats.activeUsers}/>
          </div>
        </>
    )
}
