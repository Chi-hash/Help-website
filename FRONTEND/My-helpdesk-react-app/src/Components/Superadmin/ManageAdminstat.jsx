import React from 'react'
import { TotalSuspendedAdmins } from '../StatInfo/TotalSuspendedAdmins'
import { useEffect, useState } from 'react'
import { getAuthToken, handleAuthError } from '../../utils/auth.js';
import { TotalActiveAdmins } from '../StatInfo/TotalActiveAdmins.jsx';


export const ManageAdminstat = () => {

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
    <>
      <div className="allstats">
        <TotalSuspendedAdmins suspendedAdmins={stats.suspendedAdmins} />
      <TotalActiveAdmins activeAdmins={stats.activeAdmins}/>
      </div>
    </>
  )
}
