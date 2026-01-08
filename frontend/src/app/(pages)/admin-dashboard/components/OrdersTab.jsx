import { useState, useEffect } from "react";
import { Package } from "lucide-react";

export default function OrdersTab() {
  const [orders, setOrders] = useState([]);
  const [ordersLoading, setOrdersLoading] = useState(true);
  const [ordersMessage, setOrdersMessage] = useState("");

  useEffect(() => {
    async function fetchOrders() {
      setOrdersLoading(true);
      const res = await fetch("http://localhost:5000/api/orders");
      const data = await res.json();
      console.log("Orders data:", data); // Debug log to see actual structure
      setOrders(data.orders || []);
      setOrdersLoading(false);
    }
    fetchOrders();
  }, []);

  const handleStatusChange = async (orderId, status) => {
    setOrdersMessage("");
    try {
      await fetch(`http://localhost:5000/api/orders/${orderId}/status`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      setOrders((os) =>
        os.map((o) => (o.id === orderId ? { ...o, status } : o))
      );
      setOrdersMessage(`Order ${orderId} status updated to ${status}`);
    } catch (error) {
      console.error("Status update failed", error);
    }
  };

  // Helper function to calculate total quantity
  const getTotalQuantity = (items) => {
    if (!items || !Array.isArray(items)) return 0;
    return items.reduce((total, item) => total + (item.qty || item.quantity || 0), 0);
  };

  if (ordersLoading) {
    return (
      <div className="bg-white rounded-2xl shadow-xl p-8">
        <div className="space-y-4">
          <div className="skeleton-pulse h-16 rounded-xl"></div>
          <div className="skeleton-pulse h-16 rounded-xl"></div>
          <div className="skeleton-pulse h-16 rounded-xl"></div>
        </div>
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="bg-white rounded-2xl shadow-xl p-8">
        <div className="py-16 text-center">
          <div className="text-7xl mb-4 opacity-30 mx-auto w-24">
            <Package />
          </div>
          <p className="text-gray-400 text-xl">No orders yet</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl shadow-xl p-8">
      <div className="flex items-center gap-3 mb-6">
        <div className="bg-gradient-to-br from-[#562D1D] to-[#B8860B] p-3 rounded-xl shadow-lg">
          <Package className="w-6 h-6 text-white" />
        </div>
        <h2 className="text-2xl font-bold text-gray-800">All Orders</h2>
      </div>

      <div className="overflow-x-auto rounded-xl border border-gray-200">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-[#FAF5ED] border-b-2 border-[#562D1D]/30">
              <th className="p-4 text-left font-bold text-gray-800">Order</th>
              <th className="p-4 text-left font-bold text-gray-800">User</th>
              <th className="p-4 text-left font-bold text-gray-800">Date</th>
              <th className="p-4 text-left font-bold text-gray-800">Items</th>
              <th className="p-4 text-left font-bold text-gray-800">Products</th>
              <th className="p-4 text-left font-bold text-gray-800">Total</th>
              <th className="p-4 text-left font-bold text-gray-800">Status</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order, index) => {
              // Parse items - might be JSON string
              let parsedItems = [];
              try {
                parsedItems = typeof order.items === 'string' 
                  ? JSON.parse(order.items) 
                  : (order.items || []);
              } catch (e) {
                console.error("Failed to parse items:", e);
                parsedItems = [];
              }

              // Get username - try multiple possible field names
              const username = order.username || order.user_name || order.userName || 
                             order.user?.name || order.user?.username || "N/A";
              
              // Get email - try multiple possible field names
              const useremail = order.useremail || order.user_email || order.userEmail || 
                               order.user?.email || order.email || "N/A";

              // Format date properly - try multiple date field names
              const dateValue = order.created_at || order.createdAt || order.createdat || 
                               order.order_date || order.date;
              
              let formattedDate = "N/A";
              if (dateValue) {
                try {
                  const dateObj = new Date(dateValue);
                  if (!isNaN(dateObj.getTime())) {
                    formattedDate = dateObj.toLocaleDateString('en-IN', {
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric'
                    });
                  }
                } catch (e) {
                  console.error("Date parsing error:", e);
                }
              }

              // Calculate total quantity
              const totalQuantity = getTotalQuantity(parsedItems);

              return (
                <tr
                  key={order.id}
                  className="hover:bg-[#FAF5ED]/50 transition-all duration-300 border-b border-gray-100 animate-fadeInRow"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <td className="p-4">
                    <span className="font-bold text-[#B8860B] bg-[#FAF5ED] px-3 py-1 rounded-lg">
                      #{order.id}
                    </span>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-gradient-to-br from-[#562D1D] to-[#B8860B] rounded-full flex items-center justify-center text-white font-bold shadow-md">
                        {username !== "N/A" ? username.charAt(0).toUpperCase() : "U"}
                      </div>
                      <div>
                        <div className="font-semibold text-gray-800">
                          {username}
                        </div>
                        <div className="text-xs text-gray-500">
                          {useremail}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center gap-2">
                      <svg
                        className="w-4 h-4 text-gray-400"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                        />
                      </svg>
                      <span className="text-gray-700 font-medium">
                        {formattedDate}
                      </span>
                    </div>
                  </td>
                  <td className="p-4">
                    <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-xs font-bold">
                      {totalQuantity} {totalQuantity === 1 ? "item" : "items"}
                    </span>
                  </td>
                  <td className="p-4">
                    <div className="text-xs text-gray-700 max-w-xs line-clamp-2">
                      {parsedItems.length > 0
                        ? parsedItems.map((it) => it.name).join(", ")
                        : "N/A"}
                    </div>
                  </td>
                  <td className="p-4">
                    <span className="text-lg font-bold text-gray-800">
                      ₹{order.total || order.total_amount || 0}
                    </span>
                  </td>
                  <td className="p-4">
                    <select
                      className={`rounded-lg p-2 border-2 font-semibold transition-all duration-300 cursor-pointer focus:ring-2 focus:ring-[#562D1D] focus:outline-none ${
                        order.status === "Delivered"
                          ? "bg-green-50 border-green-300 text-green-700 hover:bg-green-100"
                          : order.status === "Shipped"
                          ? "bg-blue-50 border-blue-300 text-blue-700 hover:bg-blue-100"
                          : order.status === "Processing..."
                          ? "bg-amber-50 border-amber-300 text-amber-700 hover:bg-amber-100"
                          : order.status === "Cancelled"
                          ? "bg-red-50 border-red-300 text-red-700 hover:bg-red-100"
                          : "bg-orange-50 border-orange-300 text-orange-700 hover:bg-orange-100"
                      }`}
                      value={order.status}
                      onChange={(e) => handleStatusChange(order.id, e.target.value)}
                    >
                      <option value="Placed">Placed</option>
                      <option value="Processing...">Processing...</option>
                      <option value="Shipped">Shipped</option>
                      <option value="Delivered">Delivered</option>
                      <option value="Cancelled">Cancelled</option>
                    </select>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {ordersMessage && (
        <div className="mt-4 p-4 bg-green-50 border-l-4 border-green-500 rounded-lg">
          <span className="text-green-700 font-semibold">{ordersMessage}</span>
        </div>
      )}

      <style jsx>{`
        @keyframes fadeInRow {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fadeInRow {
          animation: fadeInRow 0.5s ease-out both;
        }
        .skeleton-pulse {
          animation: pulse 1.5s ease-in-out infinite;
          background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
          background-size: 200% 100%;
        }
      `}</style>
    </div>
  );
}
