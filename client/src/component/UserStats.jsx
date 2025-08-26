import React, { useEffect, useState } from "react";
import axios from "axios";

const UserStats = () => {
  const [totalUsers, setTotalUsers] = useState(0);

  useEffect(() => {
    const fetchTotalUsers = async () => {
      try {
        const res = await axios.get(`${import.meta.env.VITE_SERVER}api/user/total-users`); // adjust route if needed
        if (res.data.success) {
          setTotalUsers(res.data.totalUsers);
        }
      } catch (err) {
        console.error("❌ Error fetching total users:", err);
      }
    };
    fetchTotalUsers();
  }, []);

  // Format large numbers nicely, e.g., 12000 → 12k+
  const formatNumber = (num) => {
    if (num >= 1000) return Math.floor(num / 1000) + "k+";
    return num;
  };

  return (
    <p className="text-xs md:text-sm text-[var(--primary-dark)]">
      Used by {formatNumber(totalUsers)} Individuals
    </p>
  );
};

export default UserStats;