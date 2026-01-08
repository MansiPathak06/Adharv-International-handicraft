import { useEffect, useState } from "react";

export default function QuickStats() {
  const [stats, setStats] = useState({ total: 0, categories: 0, active: 0 });

  useEffect(() => {
    async function fetchStats() {
      const res = await fetch("http://localhost:5000/api/products");
      const data = await res.json();
      setStats(data.stats || { total: 0, categories: 0, active: 0 });
    }
    fetchStats();
  }, []);

  return (
    <div className="bg-[#562D1D] rounded-2xl shadow-xl p-6 text-white">
      <h3 className="font-bold text-lg mb-4">Quick Stats</h3>
      <div className="space-y-4">
        <div className="flex justify-between items-center p-3 bg-white/10 rounded-xl">
          <span>Total Products</span>
          <span className="text-2xl font-bold">{stats.total}</span>
        </div>
        <div className="flex justify-between items-center p-3 bg-white/10 rounded-xl">
          <span>Categories</span>
          <span className="text-2xl font-bold">{stats.categories}</span>
        </div>
        <div className="flex justify-between items-center p-3 bg-white/10 rounded-xl">
          <span>Active Listings</span>
          <span className="text-2xl font-bold">{stats.active}</span>
        </div>
      </div>
    </div>
  );
}
