"use client";

import React, { useState, useEffect } from "react";
import {
  ChevronDown,
  Heart,
  ShoppingCart,
  Star,
  Filter,
  X,
} from "lucide-react";
import { useRouter } from "next/navigation";

const categories = [
  { id: "all", name: "All Products" }
];

const Housewares = () => {
  const [sortBy, setSortBy] = useState("best-selling");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [priceRange, setPriceRange] = useState([299, 9999]);
  const [showFilters, setShowFilters] = useState(false);
  const [wishlist, setWishlist] = useState([]);
  const [isVisible, setIsVisible] = useState(false);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    setIsVisible(true);
  }, []);

  // Fetch Housewares products from backend
  useEffect(() => {
    async function fetchProducts() {
      setLoading(true);
      try {
        const res = await fetch("http://localhost:5000/api/products");
        const data = await res.json();
        setProducts(
          (data.products || []).filter(
            (p) => (p.category || "").toLowerCase() === "housewares"
          )
        );
      } finally {
        setLoading(false);
      }
    }
    fetchProducts();
  }, []);

  // Filter by price only (no subcategory)
  const filteredProducts = products.filter((product) => {
    const priceMatch =
      product.price >= priceRange[0] && product.price <= priceRange[1];
    return priceMatch;
  });

  // Sort products
  const sortedProducts = [...filteredProducts].sort((a, b) => {
    if (sortBy === "price-low") return a.price - b.price;
    if (sortBy === "price-high") return b.price - a.price;
    if (sortBy === "rating") return (b.rating || 0) - (a.rating || 0);
    if (sortBy === "newest") return (b.id || 0) - (a.id || 0);
    return (b.reviews || 0) - (a.reviews || 0);
  });

  const toggleWishlist = (productId) => {
    setWishlist((prev) =>
      prev.includes(productId)
        ? prev.filter((id) => id !== productId)
        : [...prev, productId]
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-red-50">
      {/* Hero Banner */}
      <div
        className={`relative h-80 overflow-hidden transition-all duration-1000 ${
          isVisible ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-10"
        }`}
        style={{
          backgroundImage:
            "url(https://i.pinimg.com/1200x/4a/01/cd/4a01cd56caf1be64070de9155ee9b8ba.jpg)",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-amber-900/80 via-orange-900/60 to-transparent" />
        <div className="absolute inset-0 flex items-center">
          <div className="container mx-auto px-6 lg:px-16">
            <div className="max-w-2xl text-white space-y-4">
              <h1 className="text-5xl lg:text-6xl font-bold">Housewares</h1>
              <p className="text-xl text-amber-100">
                Functional Essentials Designed for Everyday Living
              </p>
              <p className="text-lg text-amber-200">
                Crafted for Comfort, Durability, and Style
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-6 lg:px-16 py-12">
        {/* Breadcrumb */}
        <div className="text-sm text-gray-600 mb-8">
          Home / Products /{" "}
          <span className="text-amber-700 font-medium">Housewares</span>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar Filters - Desktop */}
          <aside className="hidden lg:block w-80 flex-shrink-0">
            <div className="bg-white rounded-2xl shadow-lg p-6 sticky top-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                  <Filter size={20} />
                  Filters
                </h3>
              </div>
              <div className="mb-8">
                <h4 className="font-semibold text-gray-800 mb-4">Categories</h4>
                <div className="space-y-3">
                  {categories.map((cat) => (
                    <label
                      key={cat.id}
                      className="flex items-center gap-3 cursor-pointer group"
                    >
                      <input
                        type="radio"
                        name="category"
                        checked={selectedCategory === cat.id}
                        onChange={() => setSelectedCategory(cat.id)}
                        className="w-4 h-4 text-amber-600 focus:ring-amber-500"
                      />
                      <span className="text-gray-700 group-hover:text-amber-700 transition-colors">
                        {cat.name}
                      </span>
                    </label>
                  ))}
                </div>
              </div>
              <div className="mb-8">
                <h4 className="font-semibold text-gray-800 mb-4">
                  Price Range
                </h4>
                <div className="space-y-4">
                  <div className="flex items-center justify-between text-sm text-gray-600">
                    <span>₹{priceRange[0]}</span>
                    <span>₹{priceRange[1]}</span>
                  </div>
                  <input
                    type="range"
                    min="299"
                    max="9999"
                    value={priceRange[1]}
                    onChange={(e) =>
                      setPriceRange([priceRange[0], parseInt(e.target.value)])
                    }
                    className="w-full h-2 bg-amber-200 rounded-lg appearance-none cursor-pointer accent-amber-600"
                  />
                </div>
              </div>
              <div className="bg-gradient-to-br from-amber-100 to-orange-100 rounded-xl p-4 border-2 border-amber-300">
                <p className="text-sm font-semibold text-amber-900 mb-2">
                  ✨ Special Offer
                </p>
                <p className="text-xs text-amber-800">
                  Get up to 50% off on selected housewares
                </p>
              </div>
            </div>
          </aside>

          {/* Mobile Filter Button */}
          <button
            onClick={() => setShowFilters(true)}
            className="lg:hidden fixed bottom-6 right-6 z-50 bg-amber-600 text-white p-4 rounded-full shadow-2xl hover:bg-amber-700 transition-colors"
          >
            <Filter size={24} />
          </button>

          {showFilters && (
            <div className="lg:hidden fixed inset-0 bg-black/50 z-50 flex items-end">
              <div className="bg-white w-full rounded-t-3xl p-6 max-h-[80vh] overflow-y-auto animate-slide-up">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl font-bold text-gray-800">Filters</h3>
                  <button onClick={() => setShowFilters(false)}>
                    <X size={24} />
                  </button>
                </div>
                <div className="mb-6">
                  <h4 className="font-semibold text-gray-800 mb-4">
                    Price Range
                  </h4>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between text-sm text-gray-600">
                      <span>₹{priceRange[0]}</span>
                      <span>₹{priceRange[1]}</span>
                    </div>
                    <input
                      type="range"
                      min="299"
                      max="9999"
                      value={priceRange[1]}
                      onChange={(e) =>
                        setPriceRange([priceRange[0], parseInt(e.target.value)])
                      }
                      className="w-full h-2 bg-amber-200 rounded-lg appearance-none cursor-pointer accent-amber-600"
                    />
                  </div>
                </div>
                <button
                  onClick={() => setShowFilters(false)}
                  className="w-full py-3 bg-amber-600 text-white rounded-lg font-semibold"
                >
                  Apply Filters
                </button>
              </div>
            </div>
          )}

          {/* Main Content */}
          <div className="flex-1">
            {/* Toolbar */}
            <div className="bg-white rounded-2xl shadow-md p-4 mb-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <p className="text-gray-600">
                Showing{" "}
                <span className="font-semibold text-gray-800">
                  {sortedProducts.length}
                </span>{" "}
                products
              </p>
              <div className="flex items-center gap-2">
                <label className="text-sm text-gray-600">Sort by:</label>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                >
                  <option value="best-selling">Best Selling</option>
                  <option value="price-low">Price: Low to High</option>
                  <option value="price-high">Price: High to Low</option>
                  <option value="rating">Highest Rated</option>
                  <option value="newest">Newest First</option>
                </select>
              </div>
            </div>
            {/* Products Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {loading ? (
                <div className="col-span-full text-center text-lg py-8 text-amber-600">
                  Loading housewares...
                </div>
              ) : (
                sortedProducts.map((product, index) => (
                  <div
                    key={product.id}
                    className={`bg-white rounded-2xl shadow-md hover:shadow-2xl transition-all duration-500 overflow-hidden group ${
                      isVisible
                        ? "opacity-100 translate-y-0"
                        : "opacity-0 translate-y-10"
                    }`}
                    style={{ transitionDelay: `${index * 100}ms` }}
                    onClick={() => router.push(`/product/${product.id}`)}
                  >
                    <div className="relative overflow-hidden">
                      <img
                        src={product.main_image || product.image}
                        alt={product.name}
                        className="w-full h-72 object-cover transform group-hover:scale-110 transition-transform duration-700"
                      />
                      {(product.discount || (product.originalPrice && product.originalPrice > product.price)) && (
                        <div className="absolute top-4 left-4 bg-red-500 text-white px-3 py-1 rounded-full text-sm font-bold shadow-lg">
                          -
                          {product.discount ||
                            Math.round(
                              100 *
                                (1 -
                                  product.price /
                                    (product.originalPrice || product.price))
                            )}
                          %
                        </div>
                      )}
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleWishlist(product.id);
                        }}
                        className={`absolute top-4 right-4 w-10 h-10 rounded-full flex items-center justify-center shadow-lg transition-all duration-300 ${
                          wishlist.includes(product.id)
                            ? "bg-red-500 text-white scale-110"
                            : "bg-white text-gray-600 hover:bg-red-50"
                        }`}
                      >
                        <Heart
                          size={20}
                          fill={
                            wishlist.includes(product.id)
                              ? "currentColor"
                              : "none"
                          }
                        />
                      </button>
                    </div>
                    <div className="p-5">
                      <h3 className="text-gray-800 font-medium mb-2 line-clamp-2 h-12">
                        {product.name}
                      </h3>
                      <div className="flex items-center gap-2 mb-3">
                        <div className="flex items-center gap-1">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              size={14}
                              fill={
                                i < Math.floor(product.rating || 0)
                                  ? "#f59e0b"
                                  : "none"
                              }
                              className="text-amber-500"
                            />
                          ))}
                        </div>
                        <span className="text-sm text-gray-600">
                          {product.rating || 0} ({product.reviews || 0})
                        </span>
                      </div>
                      <div className="flex items-center gap-3 mb-4">
                        <span className="text-2xl font-bold text-gray-900">
                          ₹{product.price}
                        </span>
                        {product.originalPrice && (
                          <span className="text-sm text-gray-400 line-through">
                            ₹{product.originalPrice}
                          </span>
                        )}
                      </div>
                      <button className="w-full py-3 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-semibold rounded-lg transition-all duration-300 flex items-center justify-center gap-2 group-hover:shadow-lg">
                        <ShoppingCart size={20} />
                        Add to Cart
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
            {!loading && sortedProducts.length === 0 && (
              <div className="text-center py-20">
                <div className="text-gray-400 mb-4">
                  <Filter size={64} className="mx-auto opacity-20" />
                </div>
                <h3 className="text-2xl font-semibold text-gray-700 mb-2">
                  No products found
                </h3>
                <p className="text-gray-600">
                  Try adjusting your price range to see more products
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
      <div className="bg-white py-12 mt-16">
        <div className="container mx-auto px-6 lg:px-16">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {[
              {
                icon: "✓",
                title: "Premium Quality",
                desc: "Durable Housewares",
              },
              {
                icon: "🚚",
                title: "Free Shipping",
                desc: "On orders over ₹999",
              },
              {
                icon: "↺",
                title: "Easy Returns",
                desc: "7 Days Return Policy",
              },
              { icon: "⭐", title: "Trusted by 50K+", desc: "Happy Customers" },
            ].map((badge, idx) => (
              <div key={idx} className="space-y-2">
                <div className="text-4xl mb-2">{badge.icon}</div>
                <h4 className="font-semibold text-gray-800">{badge.title}</h4>
                <p className="text-sm text-gray-600">{badge.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
      <style jsx>{`
        @keyframes slide-up {
          from {
            transform: translateY(100%);
          }
          to {
            transform: translateY(0);
          }
        }
        .animate-slide-up {
          animation: slide-up 0.3s ease-out;
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
};

export default Housewares;
