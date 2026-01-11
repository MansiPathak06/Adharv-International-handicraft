import { useState, useEffect } from "react";
import { Package, User, X, MapPin, Phone, Mail, Calendar } from "lucide-react";

export default function OrdersTab() {
  const [orders, setOrders] = useState([]);
  const [ordersLoading, setOrdersLoading] = useState(true);
  const [ordersMessage, setOrdersMessage] = useState("");
  
  // New state for user details modal
  const [selectedUser, setSelectedUser] = useState(null);
  const [showUserModal, setShowUserModal] = useState(false);

  useEffect(() => {
    async function fetchOrders() {
      setOrdersLoading(true);
      const res = await fetch("http://localhost:5000/api/orders");
      const data = await res.json();
      console.log("Orders data:", data);
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

  // New function to open user details modal
  const openUserDetails = (order) => {
    setSelectedUser(order);
    setShowUserModal(true);
  };

  // Close modal
  const closeUserModal = () => {
    setShowUserModal(false);
    setSelectedUser(null);
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
              let parsedItems = [];
              try {
                parsedItems = typeof order.items === 'string' 
                  ? JSON.parse(order.items) 
                  : (order.items || []);
              } catch (e) {
                console.error("Failed to parse items:", e);
                parsedItems = [];
              }

              const username = order.contact_name || order.username || order.user_name || order.userName || order.user?.name || "N/A";
              const useremail = order.contact_email || order.useremail || order.user_email || order.userEmail || order.user?.email || "N/A";

              const dateValue = order.created_at || order.createdAt || order.createdat || order.order_date || order.date;
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
                    <div 
                      className="flex items-center gap-3 cursor-pointer hover:bg-blue-50 p-2 rounded-lg transition-all duration-200 group"
                      onClick={() => openUserDetails(order)}
                    >
                      <div className="w-10 h-10 bg-gradient-to-br from-[#562D1D] to-[#B8860B] rounded-full flex items-center justify-center text-white font-bold shadow-md group-hover:scale-105 transition-transform">
                        {username !== "N/A" ? username.charAt(0).toUpperCase() : "U"}
                      </div>
                      <div>
                        <div className="font-semibold text-gray-800 hover:text-[#562D1D] transition-colors">
                          {username}
                        </div>
                      
                        <div className="text-xs text-gray-500">
                          {useremail}
                        </div>
                        <br/> 
                          <p className="text-xs italic text-gray-500">Click here to see full details.</p>
                      </div>
                    </div>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-gray-400" />
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
                  <td className="p-4 ">
                    <select
                      className={`rounded-lg p-2  border-2 font-semibold transition-all duration-300 cursor-pointer focus:ring-2 focus:ring-[#562D1D] focus:outline-none ${
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

      {/* User Details Modal - Perfectly Centered */}
{showUserModal && selectedUser && (
  <div className="fixed inset-0 bg-black/70 backdrop-blur-md flex items-center justify-center z-[9999] p-4">
    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md max-h-[90vh] flex flex-col relative animate-in zoom-in-95 duration-200">
      {/* Header */}
      <div className="p-6 border-b border-gray-200 bg-gradient-to-r from-[#FAF5ED] to-amber-50 flex items-center justify-between sticky top-0 z-10">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-gradient-to-br from-[#562D1D] to-[#B8860B] rounded-xl flex items-center justify-center text-white font-bold text-lg shadow-md">
            {selectedUser.contact_name?.charAt(0).toUpperCase() || "U"}
          </div>
          <div>
            <h3 className="text-xl font-bold text-gray-800 leading-tight">
              {selectedUser.contact_name || "N/A"}
            </h3>
            <p className="text-xs text-gray-600 flex items-center gap-1 truncate max-w-[200px]">
              <Mail className="w-3 h-3" />
              {selectedUser.contact_email || "N/A"}
            </p>
          </div>
        </div>
        <button
          onClick={closeUserModal}
          className="p-2 hover:bg-gray-200 rounded-lg transition-all duration-200 flex items-center justify-center group hover:scale-105 shadow-sm hover:shadow-md bg-white/80"
          title="Close (Esc)"
        >
          <X className="w-5 h-5 text-gray-500 group-hover:text-gray-700 transition-colors" />
        </button>
      </div>

      {/* Scrollable Content */}
      <div className="flex-1 p-6 overflow-y-auto space-y-5 pb-6 pt-2">
        {/* Contact Details */}
        <div className="space-y-3">
          <h4 className="font-bold text-sm mb-2 flex items-center gap-2 text-gray-800 text-xs uppercase tracking-wide">
            <Phone className="w-4 h-4 text-[#562D1D]" />
            Contact
          </h4>
          <div className="grid grid-cols-2 gap-3 text-xs">
            <div className="bg-gray-50 p-3 rounded-lg border hover:border-gray-200 transition-colors">
              <span className="text-gray-500 block text-[10px] mb-1">Phone</span>
              <span className="font-semibold text-gray-800 truncate">
                {selectedUser.phone || "N/A"}
              </span>
            </div>
            <div className="bg-blue-50 p-3 rounded-lg border hover:border-blue-200 transition-colors">
              <span className="text-blue-600 block text-[10px] mb-1 font-medium">Payment</span>
              <span className="font-semibold text-blue-800 text-[11px]">
                {selectedUser.payment_mode || "N/A"}
              </span>
            </div>
          </div>
        </div>

        {/* Address */}
        <div>
          <h4 className="font-bold text-sm mb-2 flex items-center gap-2 text-gray-800 text-xs uppercase tracking-wide">
            <MapPin className="w-4 h-4 text-[#562D1D]" />
            Address
          </h4>
          <div className="bg-amber-50 border-2 border-amber-200 p-4 rounded-xl space-y-1 text-xs leading-tight hover:shadow-sm transition-shadow">
            <div className="font-semibold text-gray-800 text-sm">{selectedUser.contact_name}</div>
            <div className="text-gray-700">{selectedUser.address_line1 || "N/A"}</div>
            {selectedUser.address_line2 && <div className="text-gray-700">{selectedUser.address_line2}</div>}
            <div className="text-gray-700">
              {selectedUser.city}, {selectedUser.state || selectedUser.stateName}
            </div>
            <div className="text-gray-700 font-medium">
              {selectedUser.pincode && `PIN - ${selectedUser.pincode}`}
            </div>
            <div className="text-xs text-gray-600 italic">{selectedUser.country || "India"}</div>
          </div>
        </div>

        {/* Order Summary */}
        <div>
          <h4 className="font-bold text-sm mb-3 flex items-center gap-2 text-gray-800 text-xs uppercase tracking-wide">
            Order #{selectedUser.id}
          </h4>
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-4 rounded-xl border hover:shadow-md transition-all">
              <span className="text-xs text-blue-600 block mb-2 font-medium">Total Amount</span>
              <div className="text-lg font-bold text-blue-800">
                ₹{selectedUser.total || selectedUser.total_amount || 0}
              </div>
            </div>
            <div className="bg-gradient-to-br from-emerald-50 to-emerald-100 p-4 rounded-xl border hover:shadow-md transition-all">
              <span className="text-xs text-emerald-600 block mb-2 font-medium">Status</span>
              <span className="font-bold text-sm px-3 py-1.5 bg-white rounded-lg shadow-sm border text-emerald-800">
                {selectedUser.status}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Close on backdrop click */}
      <div 
        className="absolute inset-0 -z-10" 
        onClick={closeUserModal}
      />
    </div>
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
        .line-clamp-2 {
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
      `}</style>
    </div>
  );
}
