import React from 'react'
import "../Superadmin/Dashboard.css";
import { useEffect, useState } from 'react'
import { TotalUsers } from '../StatInfo/TotalUsers';
import { TotalAdmins } from '../StatInfo/TotalAdmins';
import { TotalDepartments } from '../StatInfo/TotalDepartments';
import { TotalTickets } from '../StatInfo/TotalTickets';
import { getAuthToken, handleAuthError } from '../../utils/auth.js';

export const Stats = () => {
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
        // Handle error silently
      }
    };

    fetchStats();
  }, [token]);

  if (!stats) return <p>Loading stats...</p>;
  
  return (
    <>
     <div className="allstats">
       <TotalUsers totalUsers={stats.totalUsers} />
      <TotalAdmins totalAdmins={stats.totalAdmins} />
      <TotalDepartments totalDepartments={stats.totalDepartments}/>
      <TotalTickets totalTickets={stats.totalTickets}/>
     </div>
    </>

  )
}
