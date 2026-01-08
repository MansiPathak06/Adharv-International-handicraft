'use client';
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Home, Download, Star } from "lucide-react";

const UserDashboard = () => {
  const [user, setUser] = useState({});
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [authError, setAuthError] = useState(false);
  const [expandedOrder, setExpandedOrder] = useState(null);
  const [reviewingOrder, setReviewingOrder] = useState(null);
  const [reviewData, setReviewData] = useState({ rating: 5, comment: '' });
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("token");
    const userEmail = localStorage.getItem("userEmail");

    if (!token || !userEmail) {
      setAuthError(true);
      setLoading(false);
      return;
    }

    setUser(prev => ({
      ...prev,
      name: userEmail.split("@")[0],
      email: userEmail,
      address: "Not set",
    }));

    async function fetchOrders() {
      try {
        setLoading(true);
        const res = await fetch("http://localhost:5000/api/orders/my", {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });

        if (!res.ok) {
          setOrders([]);
          return;
        }

        const data = await res.json();
        const userOrders = data.orders || [];
        
        const parsedOrders = userOrders.map(order => {
          let parsedItems = [];
          try {
            parsedItems = typeof order.items === 'string' 
              ? JSON.parse(order.items) 
              : (order.items || []);
          } catch (e) {
            console.error("Failed to parse items:", e);
            parsedItems = [];
          }
          return {
            ...order,
            items: parsedItems
          };
        });
        
        setOrders(parsedOrders);

        if (parsedOrders.length > 0) {
          const latest = parsedOrders[0];
          const fullAddress =
            latest.address ||
            [
              latest.address_line1,
              latest.address_line2,
              `${latest.city || ""} ${latest.pincode || ""}`.trim(),
              latest.state,
              latest.country || "India",
            ]
              .filter(Boolean)
              .join(", ");

          setUser({
            name: latest.contact_name || userEmail.split("@")[0],
            email: latest.contact_email || userEmail,
            address: fullAddress || "Not set",
          });
        }
      } catch (err) {
        console.error("Error fetching orders:", err);
        setOrders([]);
      } finally {
        setLoading(false);
      }
    }

    fetchOrders();
  }, [router]);

  const getTotalQuantity = (items) => {
    if (!items || !Array.isArray(items)) return 0;
    return items.reduce((total, item) => total + (item.qty || item.quantity || 1), 0);
  };

  const formatDate = (dateValue) => {
    if (!dateValue) return "N/A";
    try {
      const dateObj = new Date(dateValue);
      if (!isNaN(dateObj.getTime())) {
        return dateObj.toLocaleDateString('en-IN', {
          day: '2-digit',
          month: '2-digit',
          year: 'numeric'
        });
      }
    } catch (e) {
      console.error("Date parsing error:", e);
    }
    return "N/A";
  };

  const getImageUrl = (img) => {
    if (!img) return null;
    return img.startsWith("http") ? img : `http://localhost:5000/${img}`;
  };

  const handleDownloadInvoice = async (order) => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`http://localhost:5000/api/orders/${order.id}/invoice`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (res.ok) {
        const blob = await res.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `invoice-${order.id}.pdf`;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
      } else {
        alert("Failed to download invoice");
      }
    } catch (error) {
      console.error("Error downloading invoice:", error);
      alert("Error downloading invoice");
    }
  };

  const handleSubmitReview = async (orderId, itemId) => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`http://localhost:5000/api/orders/${orderId}/review`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          item_id: itemId,
          rating: reviewData.rating,
          comment: reviewData.comment,
        }),
      });

      if (res.ok) {
        alert("Thank you for your review!");
        setReviewingOrder(null);
        setReviewData({ rating: 5, comment: '' });
      } else {
        alert("Failed to submit review");
      }
    } catch (error) {
      console.error("Error submitting review:", error);
      alert("Error submitting review");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userEmail");
    localStorage.removeItem("username");
    router.replace("/auth");
  };

  if (authError) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-amber-50 to-orange-100">
        <div className="bg-white p-8 rounded-xl shadow-2xl text-center max-w-md">
          <div className="mb-4 text-6xl">🔒</div>
          <p className="mb-6 text-lg text-red-600 font-medium">
            You must be logged in to view your dashboard.
          </p>
          <button
            onClick={() => router.replace("/auth")}
            className="bg-[#562D1D] text-white px-8 py-3 rounded-lg font-bold hover:bg-[#b8860b] hover:scale-105 hover:shadow-lg transition-all duration-300"
          >
            Go to Login
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className=" min-h-screen container mx-auto py-10 px-4 bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50">
      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes slideIn {
          from { opacity: 0; transform: translateX(-30px); }
          to { opacity: 1; transform: translateX(0); }
        }
        @keyframes slideInRight {
          from { opacity: 0; transform: translateX(30px); }
          to { opacity: 1; transform: translateX(0); }
        }
        @keyframes shimmer {
          0% { background-position: -1000px 0; }
          100% { background-position: 1000px 0; }
        }
        .animate-fadeIn { animation: fadeIn 0.6s ease-out; }
        .animate-slideIn { animation: slideIn 0.6s ease-out; }
        .animate-slideInRight { animation: slideInRight 0.6s ease-out; }
        .skeleton {
          background: linear-gradient(90deg,#f0f0f0 25%,#e0e0e0 50%,#f0f0f0 75%);
          background-size: 1000px 100%;
          animation: shimmer 2s infinite;
        }
      `}</style>

      {/* Back to Home Button */}
      <div className="mb-6 flex items-center justify-between animate-fadeIn">
        <button
          onClick={() => router.push("/")}
          className="flex items-center gap-2 bg-white hover:bg-amber-50 text-gray-700 px-6 py-3 rounded-xl shadow-md hover:shadow-lg transition-all duration-300 hover:scale-105 font-semibold border border-amber-200"
        >
          <Home className="w-5 h-5" />
          Back to Home
        </button>
      </div>

      <div className="mb-6 text-center animate-fadeIn">
        <h1 className="text-3xl md:text-4xl font-extrabold bg-gradient-to-r from-[#b8860b] via-[#562D1D] to-[#b8860b] bg-clip-text text-transparent">
          Welcome back, {user.name || "Guest"}
        </h1>
        <p className="mt-2 text-gray-600 text-sm md:text-base">
          Track your sacred brass creations, manage your profile and revisit your favourite orders.
        </p>
      </div>

      <div className="bg-white rounded-2xl shadow-2xl p-6 flex flex-col md:flex-row gap-8 animate-fadeIn overflow-hidden">
        {/* User Profile */}
        <div className="bg-gradient-to-br from-[#562D1D] via-[#e0b962] to-[#f7ecd6] rounded-2xl p-6 w-full md:w-1/3 animate-slideIn shadow-lg hover:shadow-2xl transition-all duration-500 relative overflow-hidden group">
          <div className="absolute inset-0 bg-gradient-to-br from-white/0 via-white/10 to-white/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

          <div className="relative z-10">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-16 h-16 bg-white/30 backdrop-blur-sm rounded-full flex items-center justify-center text-3xl shadow-lg transform group-hover:scale-110 transition-transform duration-300">
                👤
              </div>
              <h2 className="font-bold text-2xl text-gray-800">My Profile</h2>
            </div>

            {loading ? (
              <div className="space-y-3">
                <div className="skeleton h-6 rounded"></div>
                <div className="skeleton h-6 rounded"></div>
                <div className="skeleton h-6 rounded"></div>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="bg-white/20 backdrop-blur-sm p-3 rounded-lg hover:bg-white/30 transition-all duration-300 transform hover:translate-x-2">
                  <span className="font-semibold text-gray-800">Name:</span>
                  <div className="text-gray-700 mt-1">{user.name}</div>
                </div>
                <div className="bg-white/20 backdrop-blur-sm p-3 rounded-lg hover:bg-white/30 transition-all duration-300 transform hover:translate-x-2">
                  <span className="font-semibold text-gray-800">Email:</span>
                  <div className="text-gray-700 mt-1">{user.email}</div>
                </div>
                <div className="bg-white/20 backdrop-blur-sm p-3 rounded-lg hover:bg-white/30 transition-all duration-300 transform hover:translate-x-2">
                  <span className="font-semibold text-gray-800">Address:</span>
                  <div className="text-gray-700 mt-1">{user.address}</div>
                </div>
              </div>
            )}

            <button
              onClick={handleLogout}
              className="w-full mt-6 bg-red-500 text-white py-3 rounded-lg font-semibold hover:bg-red-600 hover:shadow-lg hover:scale-105 transition-all duration-300 active:scale-95 cursor-pointer"
            >
              Logout
            </button>
          </div>
        </div>

        {/* Orders */}
        <div className="w-full md:w-2/3 animate-slideInRight space-y-6">
          <div className="bg-gradient-to-br from-white to-amber-50 rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-500">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="text-3xl">📦</div>
                <h2 className="font-bold text-2xl text-gray-800">My Orders</h2>
              </div>
              {orders.length > 0 && (
                <span className="text-xs md:text-sm text-gray-500">
                  You have placed <span className="font-semibold">{orders.length}</span> {orders.length === 1 ? 'order' : 'orders'}
                </span>
              )}
            </div>

            {loading ? (
              <div className="space-y-3">
                <div className="skeleton h-12 rounded"></div>
                <div className="skeleton h-12 rounded"></div>
                <div className="skeleton h-12 rounded"></div>
              </div>
            ) : (
              <div className="space-y-4">
                {orders.length === 0 ? (
                  <div className="py-12 text-center">
                    <div className="text-6xl mb-4 opacity-30">📭</div>
                    <div className="text-gray-400 text-lg">No orders placed yet.</div>
                    <p className="mt-2 text-gray-500 text-sm">
                      Explore our handcrafted brass collection and place your first royal order.
                    </p>
                  </div>
                ) : (
                  orders.map((order, index) => {
                    const totalQuantity = getTotalQuantity(order.items);
                    const formattedDate = formatDate(order.created_at || order.createdAt || order.createdat);
                    const isExpanded = expandedOrder === order.id;
                    
                    return (
                      <div
                        key={order.id}
                        className="bg-white rounded-xl border-2 border-amber-200 hover:border-amber-400 transition-all duration-300 overflow-hidden shadow-md hover:shadow-xl"
                        style={{
                          animation: `fadeIn 0.5s ease-out ${index * 0.1}s both`,
                        }}
                      >
                        {/* Order Header */}
                        <div 
                          className="p-4 cursor-pointer hover:bg-amber-50 transition-all"
                          onClick={() => setExpandedOrder(isExpanded ? null : order.id)}
                        >
                          <div className="flex items-center justify-between flex-wrap gap-4">
                            <div className="flex items-center gap-4 flex-1">
                              <span className="font-bold text-lg text-amber-800">#{order.id}</span>
                              <span className="text-sm text-gray-600">{formattedDate}</span>
                              <span className="bg-amber-200 px-3 py-1 rounded-full text-xs font-bold text-gray-800">
                                {totalQuantity} {totalQuantity === 1 ? 'item' : 'items'}
                              </span>
                            </div>
                            
                            <div className="flex items-center gap-3">
                              <span className="font-bold text-lg text-gray-800">₹{order.total}</span>
                              <span
                                className={`font-semibold px-3 py-1 rounded-full text-xs ${
                                  order.status === 'Delivered'
                                    ? 'bg-green-100 text-green-700'
                                    : order.status === 'Shipped'
                                    ? 'bg-blue-100 text-blue-700'
                                    : order.status === 'Processing...'
                                    ? 'bg-amber-100 text-amber-700'
                                    : order.status === 'Cancelled'
                                    ? 'bg-red-100 text-red-700'
                                    : 'bg-orange-100 text-orange-700'
                                }`}
                              >
                                {order.status}
                              </span>
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleDownloadInvoice(order);
                                }}
                                className="flex items-center gap-2 bg-gradient-to-r from-[#562D1D] to-[#b8860b] text-white px-4 py-2 rounded-lg font-semibold hover:scale-105 transition-all shadow-md hover:shadow-lg"
                              >
                                <Download className="w-4 h-4" />
                                Invoice
                              </button>
                            </div>
                          </div>
                        </div>

                        {/* Expanded Order Details */}
                        {isExpanded && (
                          <div className="p-4 bg-amber-50/50 border-t-2 border-amber-200">
                            <h3 className="font-bold text-gray-800 mb-3 flex items-center gap-2">
                              <span className="text-xl">📦</span>
                              Order Items
                            </h3>
                            <div className="space-y-3">
                              {order.items && order.items.map((item, idx) => (
                                <div 
                                  key={idx}
                                  className="flex items-center gap-4 bg-white p-3 rounded-lg shadow-sm hover:shadow-md transition-all"
                                >
                                  {/* Product Image */}
                                  <div className="w-20 h-20 flex-shrink-0 bg-amber-100 rounded-lg overflow-hidden border-2 border-amber-200">
                                    {item.image || item.main_image ? (
                                      <img
                                        src={getImageUrl(item.image || item.main_image)}
                                        alt={item.name}
                                        className="w-full h-full object-cover"
                                      />
                                    ) : (
                                      <div className="w-full h-full flex items-center justify-center text-2xl font-bold text-amber-600">
                                        {item.name.charAt(0)}
                                      </div>
                                    )}
                                  </div>

                                  {/* Product Details */}
                                  <div className="flex-1">
                                    <h4 className="font-semibold text-gray-800">{item.name}</h4>
                                    <p className="text-sm text-gray-600">
                                      Quantity: <span className="font-semibold">{item.qty || item.quantity || 1}</span>
                                    </p>
                                    <p className="text-sm font-bold text-amber-800">
                                      ₹{item.price}
                                    </p>
                                  </div>

                                  {/* Review Button (only if delivered) */}
                                  {order.status === 'Delivered' && (
                                    <button
                                      onClick={() => setReviewingOrder({ orderId: order.id, itemId: item.id, itemName: item.name })}
                                      className="flex items-center gap-2 bg-amber-500 hover:bg-amber-600 text-white px-4 py-2 rounded-lg text-sm font-semibold transition-all hover:scale-105"
                                    >
                                      <Star className="w-4 h-4" />
                                      Review
                                    </button>
                                  )}
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })
                )}
              </div>
            )}
          </div>

          <div className="bg-white/80 rounded-xl p-5 text-center shadow-md border border-amber-100">
            <p className="text-sm md:text-base text-gray-600">
              Each order is crafted and packed with care. Thank you for making Adharv International
              a part of your sacred spaces.
            </p>
          </div>
        </div>
      </div>

      {/* Review Modal */}
      {reviewingOrder && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full shadow-2xl animate-fadeIn">
            <h3 className="text-2xl font-bold text-gray-800 mb-4">
              Rate Your Experience
            </h3>
            <p className="text-gray-600 mb-4">
              How was your experience with <span className="font-semibold">{reviewingOrder.itemName}</span>?
            </p>

            {/* Star Rating */}
            <div className="flex items-center justify-center gap-2 mb-6">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  onClick={() => setReviewData({ ...reviewData, rating: star })}
                  className="transition-all hover:scale-110"
                >
                  <Star
                    className={`w-10 h-10 ${
                      star <= reviewData.rating
                        ? 'fill-amber-500 text-amber-500'
                        : 'text-gray-300'
                    }`}
                  />
                </button>
              ))}
            </div>

            {/* Comment */}
            <textarea
              value={reviewData.comment}
              onChange={(e) => setReviewData({ ...reviewData, comment: e.target.value })}
              placeholder="Share your thoughts about this product..."
              className="w-full p-3 border-2 border-amber-200 rounded-lg focus:border-amber-500 focus:outline-none mb-4 resize-none"
              rows={4}
            />

            {/* Buttons */}
            <div className="flex gap-3">
              <button
                onClick={() => {
                  setReviewingOrder(null);
                  setReviewData({ rating: 5, comment: '' });
                }}
                className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-700 py-3 rounded-lg font-semibold transition-all"
              >
                Cancel
              </button>
              <button
                onClick={() => handleSubmitReview(reviewingOrder.orderId, reviewingOrder.itemId)}
                className="flex-1 bg-gradient-to-r from-[#562D1D] to-[#b8860b] hover:from-[#b8860b] hover:to-[#562D1D] text-white py-3 rounded-lg font-semibold transition-all hover:scale-105"
              >
                Submit Review
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserDashboard;
