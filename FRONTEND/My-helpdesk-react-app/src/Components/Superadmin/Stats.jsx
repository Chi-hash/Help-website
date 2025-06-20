import React from 'react'
import "../Superadmin/Dashboard.css";
import { useEffect, useState } from 'react'
import { TotalUsers } from '../StatInfo/TotalUsers';
import { TotalAdmins } from '../StatInfo/TotalAdmins';
import { TotalDepartments } from '../StatInfo/TotalDepartments';
import { TotalTickets } from '../StatInfo/TotalTickets';

export const Stats = () => {
  const [stats, setStats] = useState(null);

  console.log("Raw localStorage user:", localStorage.getItem("user"));
  const token = JSON.parse(localStorage.getItem("user") || "{}")?.token;
  console.log(token);
  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await fetch("/api/superadmin/superAdmin-Dashboard", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const data = await res.json();
        if (data.success) {
          setStats(data.data);
        } else {
          console.error("Failed to load stats");
        }
      } catch (err) {
        console.error("Dashboard error:", err);
      }
    };

    fetchStats();
  }, [token]);

  if (!stats) return <p>Loading stats...</p>;
  console.log("Stats:", stats);
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
