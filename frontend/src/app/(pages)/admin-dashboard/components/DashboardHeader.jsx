import { ShoppingBag, LogOut } from "lucide-react";

export default function DashboardHeader({ onLogout }) {
  return (
    <div className="max-w-7xl mx-auto mb-8">
      <div className="bg-[#562D1D] rounded-2xl shadow-lg p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="bg-white/20 p-3 rounded-xl shadow-lg">
              <ShoppingBag className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-white">Admin Dashboard</h1>
              <p className="text-white/80 text-sm mt-1">
                Manage your brass products and inventory
              </p>
            </div>
          </div>
          <button
            className="flex items-center gap-2 bg-red-900 hover:bg-red-800 text-white font-semibold py-3 px-6 rounded-xl shadow-lg hover:scale-105 transition-all"
            onClick={onLogout}
          >
            <LogOut className="w-5 h-5" />
            Logout
          </button>
        </div>
      </div>
    </div>
  );
}
