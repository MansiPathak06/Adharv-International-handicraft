'use client';

import React, { useState, useEffect } from 'react';
import { Heart, Settings } from 'lucide-react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

const categories = [
  { name: 'All Products', key: 'all' },
];

const absoluteMin = 0;
const absoluteMax = 10000;

const GardenAccessories = () => {
  const [products, setProducts] = useState([]);
  const [favorites, setFavorites] = useState({});
  const [minPrice, setMinPrice] = useState(299);
  const [maxPrice, setMaxPrice] = useState(9999);
  const [sortBy, setSortBy] = useState('best-selling');
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [isDragging, setIsDragging] = useState(false);
  const [currentHandle, setCurrentHandle] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [loading, setLoading] = useState(true);

  const router = useRouter();

  useEffect(() => {
    async function fetchProducts() {
      setLoading(true);
      try {
        const res = await fetch('http://localhost:5000/api/products');
        const data = await res.json();
        // Filter only Garden Accessories products
        const gardenProducts = (data.products || []).filter(
          (prod) => (prod.category || '').toLowerCase() === 'garden accessories'
        );
        setProducts(gardenProducts);
      } finally {
        setLoading(false);
      }
    }
    fetchProducts();
  }, []);

  const toggleFavorite = (id) => {
    setFavorites((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const getFilteredProducts = () => {
    let filtered = products;
    // No subcategory filtering needed as Garden Accessories has no subcategories
    filtered = filtered.filter(
      (p) => p.price >= minPrice && p.price <= maxPrice,
    );
    if (sortBy === 'price-low') {
      filtered = [...filtered].sort((a, b) => a.price - b.price);
    } else if (sortBy === 'price-high') {
      filtered = [...filtered].sort((a, b) => b.price - a.price);
    } else if (sortBy === 'discount') {
      filtered = [...filtered].sort(
        (a, b) => (b.discount || 0) - (a.discount || 0),
      );
    }
    return filtered;
  };

  const minPercent =
    ((minPrice - absoluteMin) / (absoluteMax - absoluteMin)) * 100;
  const maxPercent =
    ((maxPrice - absoluteMin) / (absoluteMax - absoluteMin)) * 100;

  const handleMouseMove = (e) => {
    if (!isDragging || !currentHandle) return;
    const slider = document.querySelector('.price-slider');
    if (!slider) return;
    const rect = slider.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const percent = Math.max(0, Math.min(100, (x / rect.width) * 100));
    const value = Math.round(
      (percent / 100) * (absoluteMax - absoluteMin) + absoluteMin,
    );
    if (currentHandle === 'min') {
      setMinPrice(Math.min(value, maxPrice));
    } else {
      setMaxPrice(Math.max(value, minPrice));
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
    setCurrentHandle(null);
  };

  useEffect(() => {
    if (isDragging) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
      return () => {
        window.removeEventListener('mousemove', handleMouseMove);
        window.removeEventListener('mouseup', handleMouseUp);
      };
    }
  }, [isDragging, currentHandle, minPrice, maxPrice]);

  const filteredProducts = getFilteredProducts();

  return (
    <div 
      className="min-h-screen"
      style={{
        backgroundImage: "url('/images/home-background-img.jpg')",
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundAttachment: 'fixed',
        backgroundRepeat: 'no-repeat'
      }}
    >
     {/* Hero Banner */}
<div className="relative w-full max-w-[1400px] mx-auto mt-0 mb-6 sm:mb-8 h-[220px] sm:h-[260px] lg:h-[320px] overflow-hidden shadow-[0_15px_40px_rgba(0,0,0,0.2)]">
  {/* Background Image */}
  <div 
    className="absolute inset-0 bg-cover bg-center"
    style={{
      backgroundImage: 'url(/images/garden-decoratives-bg.png)',
    }}
  >
    <div className="absolute inset-0 bg-gradient-to-r from-black/30 via-black/10 to-black/40"></div>
  </div>

  

  {/* Floating particles effect */}
  <div className="absolute inset-0 overflow-hidden pointer-events-none">
    <div className="absolute w-2 h-2 bg-amber-300/30 rounded-full top-[20%] left-[15%] animate-pulse"></div>
    <div className="absolute w-3 h-3 bg-green-300/30 rounded-full top-[70%] right-[20%] animate-pulse" style={{animationDelay: '0.5s'}}></div>
    <div className="absolute w-2 h-2 bg-amber-400/40 rounded-full bottom-[30%] left-[80%] animate-pulse" style={{animationDelay: '1s'}}></div>
  </div>
</div>
      {/* CTA Banner for garden decor */}
      {/* <div
        className="max-w-[1100px] mx-auto my-10 sm:my-12 rounded-2xl shadow-lg overflow-hidden group cursor-pointer relative animate-fadeInUp px-3 sm:px-0"
        onClick={() => router.push('/garden-decor')}
      >
        <div className="relative">
          <img
            src="https://i.pinimg.com/1200x/09/c8/53/09c8531ccb0c89963617d51ede88bb36.jpg"
            alt="Shop Garden Decor"
            className="w-full h-40 sm:h-48 object-cover group-hover:opacity-80 transition-opacity duration-400"
          />
          <div className="absolute inset-0 z-10 flex flex-col items-start justify-center px-6 sm:px-12 bg-gradient-to-r from-[#2c3e50]/40 via-transparent to-black/60">
            <h3 className="text-lg sm:text-2xl font-bold text-white mb-1 animate-slideUp">
              Transform Your Garden Space
            </h3>
            <p className="text-sm sm:text-lg text-white opacity-80 mb-2 transition">
              Shop trending and timeless garden accents.
            </p>
            <Link href="/garden-decor">
              <button className="text-xs sm:text-sm md:text-base text-[#3a6b1f] px-6 sm:px-8 py-2 bg-white/80 rounded-lg font-bold shadow hover:bg-[#2d5016] hover:text-white transition animate-fadeInUp">
                Shop Garden Decor Now
              </button>
            </Link>
          </div>
        </div>
      </div> */}

      {/* Main Container */}
      <div className="max-w-[1400px] mx-auto py-8 sm:py-10 px-3 sm:px-5">
        <h1 className="text-center text-xs sm:text-sm tracking-[3px] text-gray-600 mb-6 sm:mb-8 font-medium uppercase animate-fadeInUp">
          GARDEN ACCESSORIES
        </h1>

        {/* Controls Bar */}
        <div className="flex justify-between items-center mb-6 sm:mb-8 gap-3 sm:gap-5 flex-wrap animate-fadeInUp animation-delay-200">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="flex items-center gap-2.5 py-2.5 sm:py-3 px-4 sm:px-6 bg-white border-2 border-gray-300 rounded-lg cursor-pointer text-xs sm:text-sm font-medium transition-all duration-300 hover:border-[#2d5016] hover:shadow-[0_4px_12px_rgba(61,107,31,0.2)] text-gray-800 font-medium hover:-translate-y-0.5"
          >
            <Settings size={18} />
            <span>Filters</span>
          </button>
          <div className="flex items-center gap-2.5">
            <label
              htmlFor="sortBy"
              className="text-xs sm:text-sm text-gray-600"
            >
              Sort by:
            </label>
            <select
              id="sortBy"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="py-2 px-3 sm:px-4 pr-8 sm:pr-9 border-2 border-gray-300 rounded-lg text-xs sm:text-sm bg-white cursor-pointer appearance-none bg-[url('data:image/svg+xml,%3Csvg%20xmlns=%27http://www.w3.org/2000/svg%27%20width=%2712%27%20height=%2712%27%20viewBox=%270%200%2012%2012%27%3E%3Cpath%20fill=%27%23333%27%20d=%27M6%209L1%204h10z%27/%3E%3C/svg%3E')] bg-no-repeat bg-[right_10px_center] text-gray-800 font-medium transition-all duration-300  focus:outline-none focus:border-[#2d5016] hover:border-[#2d5016]"
            >
              <option value="best-selling">Best selling</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
              <option value="discount">Discount</option>
            </select>
          </div>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-6 sm:gap-10">
          {/* Sidebar */}
          <aside
            className={`bg-white p-6 sm:p-8 rounded-xl h-fit shadow-[0_2px_12px_rgba(0,0,0,0.08)] lg:sticky lg:top-5 transition-all duration-300 animate-fadeInUp animation-delay-400 ${
              sidebarOpen ? 'block' : 'hidden lg:block'
            }`}
          >
            <h2 className="text-sm sm:text-base font-semibold mb-5 sm:mb-6 text-gray-800 uppercase tracking-wide animate-fadeInUp">
              Categories
            </h2>
            <ul className="list-none">
              {categories.map((category, idx) => (
                <li
                  key={category.key}
                  className="mb-2.5 sm:mb-3 animate-fadeInUp"
                  style={{ animationDelay: `${500 + idx * 50}ms` }}
                >
                  <button
                    onClick={() => setSelectedCategory(category.key)}
                    className={`w-full text-left text-xs sm:text-sm transition-all duration-300 py-2 px-3 rounded-lg ${
                      selectedCategory === category.key
                        ? 'text-[#2d5016] bg-gradient-to-r from-[#2d5016]/10 to-[#3a6b1f]/10 font-semibold pl-5 border-l-4 border-[#2d5016]'
                        : 'text-gray-600 hover:text-[#2d5016] hover:pl-5 hover:bg-gray-50'
                    }`}
                  >
                    {category.name}
                  </button>
                </li>
              ))}
            </ul>

            <div className="mt-7 sm:mt-9 pt-6 sm:pt-8 border-t border-gray-200">
              <h2 className="text-sm sm:text-base font-semibold mb-5 sm:mb-6 text-gray-800 uppercase tracking-wide">
                Price
              </h2>
              <div className="flex gap-3 sm:gap-4 mb-5 sm:mb-6">
                <div className="flex-1">
                  <label className="text-[11px] sm:text-xs text-gray-600 block mb-1.5 sm:mb-2 font-medium">
                    Min
                  </label>
                  <input
                    type="number"
                    value={minPrice}
                    onChange={(e) =>
                      setMinPrice(
                        Math.min(
                          parseInt(e.target.value) || absoluteMin,
                          maxPrice,
                        ),
                      )
                    }
                    className="w-full py-2 px-2.5 border-2 text-gray-800 font-medium border-gray-300 rounded-md text-xs sm:text-sm transition-all duration-300 focus:outline-none focus:border-[#2d5016]"
                  />
                </div>
                <div className="flex-1">
                  <label className="text-[11px] sm:text-xs text-gray-600 block mb-1.5 sm:mb-2 font-medium">
                    Max
                  </label>
                  <input
                    type="number"
                    value={maxPrice}
                    onChange={(e) =>
                      setMaxPrice(
                        Math.max(
                          parseInt(e.target.value) || absoluteMax,
                          minPrice,
                        ),
                      )
                    }
                    className="w-full py-2 px-2.5 text-gray-800 font-medium border-2 border-gray-300 rounded-md text-xs sm:text-sm transition-all duration-300 focus:outline-none focus:border-[#2d5016]"
                  />
                </div>
              </div>
              <div className="price-slider relative h-1.5 bg-gray-300 rounded-full my-6 sm:my-8">
                <div
                  className="absolute h-full bg-gradient-to-r from-[#2d5016] to-[#3a6b1f] rounded-full transition-all duration-200"
                  style={{
                    left: `${minPercent}%`,
                    width: `${maxPercent - minPercent}%`,
                  }}
                />
                <div
                  className="absolute w-4 h-4 sm:w-5 sm:h-5 bg-white border-[3px] border-[#2d5016] rounded-full top-1/2 -translate-y-1/2 cursor-pointer shadow-md z-[2] transition-all duration-200 hover:scale-110 hover:shadow-[0_4px_12px_rgba(61,107,31,0.4)]"
                  style={{
                    left: `${minPercent}%`,
                    transform: 'translate(-50%, -50%)',
                  }}
                  onMouseDown={() => {
                    setIsDragging(true);
                    setCurrentHandle('min');
                  }}
                />
                <div
                  className="absolute w-4 h-4 sm:w-5 sm:h-5 bg-white border-[3px] border-[#2d5016] rounded-full top-1/2 -translate-y-1/2 cursor-pointer shadow-md z-[2] transition-all duration-200 hover:scale-110 hover:shadow-[0_4px_12px_rgba(61,107,31,0.4)]"
                  style={{
                    left: `${maxPercent}%`,
                    transform: 'translate(-50%, -50%)',
                  }}
                  onMouseDown={() => {
                    setIsDragging(true);
                    setCurrentHandle('max');
                  }}
                />
              </div>
            </div>
          </aside>

          {/* Products Grid */}
          <div>
            <div className="mb-4 sm:mb-6 flex items-center justify-between">
              <p className="text-xs sm:text-sm text-gray-600">
                Showing{' '}
                <span className="font-semibold text-[#2d5016]">
                  {filteredProducts.length}
                </span>{' '}
                products
              </p>
            </div>
            {loading ? (
              <div className="flex flex-col items-center justify-center min-h-[160px] sm:min-h-[200px] gap-3 animate-fadeIn">
                <svg
                  className="animate-spin h-10 w-10 sm:h-12 sm:w-12 text-[#3a6b1f]"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="#2d5016"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="#3a6b1f"
                    d="M4 12a8 8 0 018-8v8z"
                  ></path>
                </svg>
                <div className="text-[#3a6b1f] font-semibold text-base sm:text-lg">
                  Loading products...
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-3 gap-5 sm:gap-6">
                {filteredProducts.map((product, idx) => (
                  <div
                    key={product.id}
                    className="bg-white rounded-xl overflow-hidden transition-all duration-500 cursor-pointer shadow-[0_2px_8px_rgba(0,0,0,0.06)] hover:-translate-y-2 hover:shadow-[0_12px_24px_rgba(0,0,0,0.12)] animate-fadeInUp group"
                    style={{ animationDelay: `${idx * 50}ms` }}
                    onClick={() => router.push(`/product/${product.id}`)}
                  >
                    <div className="relative h-60 sm:h-[260px] md:h-[300px] overflow-hidden bg-gray-100">
                      <img
                        src={product.main_image || product.image}
                        alt={product.name}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                      />
                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors duration-500" />
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleFavorite(product.id);
                        }}
                        className={`absolute top-3 sm:top-4 right-3 sm:right-4 w-9 h-9 sm:w-10 sm:h-10 rounded-full border-none cursor-pointer flex items-center justify-center shadow-md transition-all duration-300 z-[1] hover:scale-110 ${
                          favorites[product.id]
                            ? 'bg-red-500'
                            : 'bg-white/90 backdrop-blur-sm hover:bg-red-50'
                        }`}
                      >
                        <Heart
                          size={18}
                          className={
                            favorites[product.id]
                              ? 'fill-white stroke-white'
                              : 'fill-none stroke-gray-600'
                          }
                          strokeWidth={2}
                        />
                      </button>
                      <span className="absolute top-3 sm:top-4 left-3 sm:left-4 bg-gradient-to-r from-red-600 to-red-500 text-white py-1 px-2.5 sm:px-3 rounded-full font-bold text-[10px] sm:text-xs shadow-lg">
                        {product.discount ||
                          Math.round(
                            100 *
                              (1 -
                                product.price /
                                  (product.originalPrice ||
                                    product.discounted_price ||
                                    product.price)),
                          )}
                        % OFF
                      </span>
                    </div>
                    <div className="p-4 sm:p-5">
                      <div className="text-sm sm:text-[15px] text-gray-800 mb-2.5 sm:mb-3 leading-relaxed h-10 sm:h-[45px] overflow-hidden line-clamp-2 font-medium">
                        {product.name}
                      </div>
                      <div className="flex items-center gap-2.5 flex-wrap mb-2.5 sm:mb-3">
                        <span className="text-lg sm:text-xl font-bold text-gray-900">
                          ₹ {product.price?.toLocaleString()}
                        </span>
                        {(product.originalPrice ||
                          product.discounted_price) && (
                          <span className="text-xs sm:text-sm text-gray-400 line-through">
                            ₹{' '}
                            {(
                              product.originalPrice ||
                              product.discounted_price
                            )?.toLocaleString()}
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-yellow-400 text-xs sm:text-sm">
                          {product.rating
                            ? '⭐'.repeat(Math.floor(product.rating))
                            : ''}
                        </span>
                        <span className="text-[11px] sm:text-xs text-gray-500">
                          {product.reviews
                            ? `(${product.reviews} reviews)`
                            : ''}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
            {!loading && filteredProducts.length === 0 && (
              <div className="text-center py-16 sm:py-20">
                <div className="text-4xl sm:text-6xl mb-3 sm:mb-4">🔍</div>
                <h3 className="text-xl sm:text-2xl font-semibold text-gray-800 mb-2">
                  No products found
                </h3>
                <p className="text-sm sm:text-base text-gray-600">
                  Try adjusting your price range to see more products
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }
        @keyframes slideDown {
          from {
            opacity: 0;
            transform: translateY(-20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(40px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fadeIn {
          animation: fadeIn 0.8s ease;
        }
        .animate-slideDown {
          animation: slideDown 1.2s;
        }
        .animate-slideUp {
          animation: slideUp 1.1s;
        }
        .animate-fadeInUp {
          animation: fadeInUp 1s both;
        }
        .animation-delay-200 {
          animation-delay: 0.2s !important;
        }
        .animation-delay-400 {
          animation-delay: 0.4s !important;
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

export default GardenAccessories;
