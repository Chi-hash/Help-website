import React from 'react'
import { useEffect, useState } from 'react'
import { TotalUsers } from '../StatInfo/TotalUsers';

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
    <TotalUsers totalUsers={stats.totalUsers}/>

  )
}
