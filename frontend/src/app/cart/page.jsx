"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

const CartPage = () => {
  const [items, setItems] = useState([]);
  const [checkingOut, setCheckingOut] = useState(false);
  const [message, setMessage] = useState("");
  const [isLoaded, setIsLoaded] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const userEmail = localStorage.getItem("userEmail");
    if (!userEmail) {
      setMessage("Please login to view your cart.");
      setTimeout(() => router.replace("/auth"), 1500);
      return;
    }
    const cartKey = `cartItems:${userEmail.toLowerCase()}`;
    const stored = JSON.parse(localStorage.getItem(cartKey) || "[]");

    // ✅ ADD THIS - Filter out out-of-stock items
    const validItems = stored.filter(
      (item) => item.stock !== 0 && item.stock !== false
    );

    // If some items were removed due to stock, show message
    if (validItems.length < stored.length) {
      setMessage("Some out-of-stock items were removed from your cart");
      setTimeout(() => setMessage(""), 3000);
      updateStorage(validItems); // Update storage with valid items only
    }

    setItems(validItems);
    setTimeout(() => setIsLoaded(true), 100);
  }, [router]);

  const updateStorage = (newItems) => {
    const userEmail = localStorage.getItem("userEmail");
    if (!userEmail) return;
    const cartKey = `cartItems:${userEmail.toLowerCase()}`;
    setItems(newItems);
    localStorage.setItem(cartKey, JSON.stringify(newItems));
    window.dispatchEvent(new Event("cart-updated"));
  };

  const changeQty = (id, delta) => {
    const updated = items
      .map((i) => (i.id === id ? { ...i, qty: Math.max(1, i.qty + delta) } : i))
      .filter((i) => i.qty > 0);
    updateStorage(updated);
  };

  const removeItem = (id) => {
    const updated = items.filter((i) => i.id !== id);
    updateStorage(updated);
  };

  const total = items.reduce((sum, i) => sum + i.price * i.qty, 0);

  const handleBuyNow = () => {
    const token = localStorage.getItem("token");
    const userEmail = localStorage.getItem("userEmail");
    if (!token || !userEmail) {
      setMessage("Please login to proceed to checkout.");
      setTimeout(() => router.replace("/auth"), 1500);
      return;
    }
    if (items.length === 0) {
      setMessage("Your cart is empty.");
      return;
    }
    const first = items[0];
    router.push(`/checkout?product=${first.id}&qty=${first.qty}`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-white to-orange-50 py-10">
      <style jsx>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }

        @keyframes slideInRight {
          from {
            opacity: 0;
            transform: translateX(20px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        @keyframes pulse {
          0%,
          100% {
            transform: scale(1);
          }
          50% {
            transform: scale(1.05);
          }
        }

        @keyframes shimmer {
          0% {
            background-position: -200% 0;
          }
          100% {
            background-position: 200% 0;
          }
        }

        .animate-fade-in-up {
          animation: fadeInUp 0.6s ease-out forwards;
        }

        .animate-fade-in {
          animation: fadeIn 0.5s ease-out forwards;
        }

        .animate-slide-in-right {
          animation: slideInRight 0.5s ease-out forwards;
        }

        .item-enter {
          animation: fadeInUp 0.5s ease-out forwards;
        }

        .shimmer {
          background: linear-gradient(
            90deg,
            transparent,
            rgba(184, 134, 11, 0.1),
            transparent
          );
          background-size: 200% 100%;
          animation: shimmer 2s infinite;
        }

        .hover-lift {
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .hover-lift:hover {
          transform: translateY(-4px);
          box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1),
            0 10px 10px -5px rgba(0, 0, 0, 0.04);
        }

        .btn-hover {
          transition: all 0.3s ease;
          position: relative;
          overflow: hidden;
        }

        .btn-hover::before {
          content: "";
          position: absolute;
          top: 0;
          left: -100%;
          width: 100%;
          height: 100%;
          background: linear-gradient(
            90deg,
            transparent,
            rgba(255, 255, 255, 0.3),
            transparent
          );
          transition: left 0.5s ease;
        }

        .btn-hover:hover::before {
          left: 100%;
        }

        .qty-btn {
          transition: all 0.2s ease;
        }

        .qty-btn:hover {
          transform: scale(1.1);
          background: linear-gradient(135deg, #b8860b 0%, #562D1D 100%);
          color: white;
          border-color: transparent;
        }

        .qty-btn:active {
          transform: scale(0.95);
        }

        .remove-btn {
          transition: all 0.2s ease;
        }

        .remove-btn:hover {
          transform: scale(1.1);
          color: #dc2626;
        }

        .total-badge {
          transition: all 0.3s ease;
        }

        .total-badge:hover {
          transform: scale(1.05);
        }

        @keyframes messageSlide {
          from {
            opacity: 0;
            transform: translateY(-20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .message-enter {
          animation: messageSlide 0.4s ease-out forwards;
        }
      `}</style>

      <div
        className={`max-w-5xl mx-auto bg-white rounded-2xl shadow-xl p-6 lg:p-10 transition-all duration-500 ${
          isLoaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
        }`}
      >
        <h1 className="text-3xl font-bold mb-6 text-[#b8860b] animate-fade-in">
          Your Cart
          {items.length > 0 && (
            <span className="ml-3 text-lg font-normal text-gray-500 animate-slide-in-right">
              ({items.length} {items.length === 1 ? "item" : "items"})
            </span>
          )}
        </h1>

        {items.length === 0 ? (
          <div className="py-16 text-center animate-fade-in-up">
            <div className="text-6xl mb-4 opacity-20">🛒</div>
            <div className="text-gray-400 text-lg">Your cart is empty.</div>
          </div>
        ) : (
          <>
            <div className="space-y-4">
              {items.map((item, index) => (
                <div
                  key={item.id}
                  className="flex items-center gap-4 border rounded-xl p-4 bg-gradient-to-r from-white to-amber-50 hover-lift item-enter"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <div className="relative overflow-hidden rounded-lg group">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-20 h-20 object-cover transition-transform duration-300 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  </div>

                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-800 transition-colors duration-200 hover:text-[#b8860b]">
                      {item.name}
                    </h3>
                    <div className="text-[#562D1D] font-bold transition-all duration-200 hover:scale-105 inline-block">
                      ₹{item.price}
                    </div>

                    {/* ✅ ADD THIS STOCK WARNING */}
                    {(item.stock === 0 || item.stock === false) && (
                      <div className="text-xs text-red-600 font-semibold mt-1 bg-red-50 px-2 py-1 rounded inline-block">
                        ⚠️ Out of Stock
                      </div>
                    )}
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => changeQty(item.id, -1)}
                      className="border border-gray-300 px-3 py-1 rounded font-bold qty-btn text-gray-800"
                    >
                      -
                    </button>
                    <span className="w-8 text-center font-semibold transition-all duration-200 text-gray-800">
                      {item.qty}
                    </span>
                    <button
                      onClick={() => changeQty(item.id, 1)}
                      className="border border-gray-300 px-3 py-1 rounded font-bold qty-btn text-gray-800"
                    >
                      +
                    </button>
                  </div>

                  <div className="w-24 text-right font-semibold text-gray-800 transition-all duration-200 hover:text-[#b8860b] hover:scale-105">
                    ₹{item.price * item.qty}
                  </div>

                  <button
                    onClick={() => removeItem(item.id)}
                    className="text-red-500 text-sm font-semibold ml-2 remove-btn"
                  >
                    Remove
                  </button>
                </div>
              ))}
            </div>

            <div
              className="mt-8 flex flex-col md:flex-row justify-between items-center gap-4 animate-fade-in-up"
              style={{ animationDelay: "0.3s" }}
            >
              <div className="text-xl font-bold total-badge text-gray-800">
                Total: <span className="text-[#562D1D] text-2xl">₹{total}</span>
              </div>
              <button
                disabled={checkingOut || items.length === 0}
                onClick={handleBuyNow}
                className="w-full md:w-auto bg-gradient-to-r from-[#b8860b] to-[#562D1D] text-white font-bold py-3 px-10 rounded-xl shadow-lg hover:scale-105 hover:shadow-2xl transition-all duration-300 disabled:opacity-50 disabled:hover:scale-100 btn-hover"
              >
                {checkingOut ? (
                  <span className="flex items-center justify-center gap-2">
                    <span className="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Processing...
                  </span>
                ) : (
                  "Proceed to Buy Now"
                )}
              </button>
            </div>
          </>
        )}

        {message && (
          <div className="mt-4 text-center text-sm font-semibold text-red-600 message-enter bg-red-50 py-3 px-4 rounded-lg border border-red-200">
            {message}
          </div>
        )}
      </div>
    </div>
  );
};

export default CartPage;
