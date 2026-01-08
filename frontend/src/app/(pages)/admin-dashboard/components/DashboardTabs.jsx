import { Package, Edit } from "lucide-react";

export default function DashboardTabs({ activeTab, setActiveTab }) {
  const tabs = [
    { id: "add", label: "Add Product", icon: Package },
    { id: "manage", label: "Manage Products", icon: Edit },
    { id: "orders", label: "Orders", icon: Package },
  ];

  return (
    <div className="max-w-7xl mx-auto mb-6">
      <div className="flex gap-3 bg-white p-2 rounded-xl shadow-md">
        {tabs.map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            onClick={() => setActiveTab(id)}
            className={`flex items-center gap-2 px-6 py-3 rounded-lg font-semibold transition-all duration-300 ${
              activeTab === id
                ? "bg-[#562D1D] text-white scale-105 shadow-lg"
                : "text-gray-600 hover:bg-[#FAF5ED] hover:shadow-md"
            }`}
          >
            <Icon className="w-5 h-5" />
            {label}
          </button>
        ))}
      </div>
    </div>
  );
}
