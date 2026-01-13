'use client';

import React, { useState, useEffect } from 'react';
import { Heart, Settings } from 'lucide-react';
import { useRouter } from 'next/navigation';

const categories = [
  { name: 'All Collections', key: 'all' },
  { name: 'Garden Accessories', key: 'Garden Accessories' },
  { name: 'Candles and Fragrance', key: 'Candles and Fragrance' },
  { name: 'Decoratives', key: 'Decoratives' },
  { name: 'Table Tops', key: 'Table Tops' },
  { name: 'Housewares', key: 'Housewares' }, // ✅ FIXED!
  { name: 'Furniture', key: 'Furniture' },
  { name: 'Lightning', key: 'Lightning' },
  { name: 'Kitchenware', key: 'Kitchenware' },
  { name: 'Candle Stands and Holders', key: 'Candle Stand and Holders' }, // ✅ Fixed: "Stand" singular
];


const absoluteMin = 0;
const absoluteMax = 10000;

const ShopByCollection = () => {
  const router = useRouter();
  const [products, setProducts] = useState([]);
  const [favorites, setFavorites] = useState({});
  const [minPrice, setMinPrice] = useState(449);
  const [maxPrice, setMaxPrice] = useState(7499);
  const [sortBy, setSortBy] = useState('best-selling');
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [isDragging, setIsDragging] = useState(false);
  const [currentHandle, setCurrentHandle] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [loading, setLoading] = useState(true);

  // Fetch products
  useEffect(() => {
    async function fetchProducts() {
      setLoading(true);
      try {
        const res = await fetch('http://localhost:5000/api/products');
        const data = await res.json();
        setProducts(data.products || []);
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

  // Filter and sort
// Filter and sort
const getFilteredProducts = () => {
  let filtered = products;

  // ✅ DEBUG: Log all products before filtering
  console.log('🔍 All products loaded:', products.length);
  console.log('🔍 Selected category:', selectedCategory);
  console.log('🔍 Price range:', minPrice, '-', maxPrice);

  if (selectedCategory !== 'all') {
    filtered = filtered.filter((p) => {
      const productCategory = (p.category || '').trim().toLowerCase();
      const selectedCat = selectedCategory.toLowerCase();
      const match = productCategory === selectedCat;
      
      // ✅ DEBUG: Log each comparison
      if (match) {
        console.log(`✅ Category Match: "${p.category}" (${p.name}) - Price: ₹${p.price}`);
      }
      
      return match;
    });
    
    console.log(`📦 After category filter: ${filtered.length} products`);
  }

  // ✅ DEBUG: Log before price filtering
  const beforePriceFilter = filtered.length;
  
  filtered = filtered.filter((p) => {
    const inRange = p.price >= minPrice && p.price <= maxPrice;
    
    // ✅ DEBUG: Log products filtered OUT by price
    if (!inRange) {
      console.log(`❌ Price filtered OUT: ${p.name} - ₹${p.price} (range: ₹${minPrice}-₹${maxPrice})`);
    }
    
    return inRange;
  });

  console.log(`📦 After price filter: ${filtered.length} products (removed ${beforePriceFilter - filtered.length})`);

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
    <div className="bg-gray-50 min-h-screen">
      {/* Hero Banner */}
      
<div className="relative w-full max-w-[1400px] mx-auto mt-0 mb-6 sm:mb-8 h-[240px] sm:h-[280px] lg:h-[300px] overflow-hidden shadow-[0_10px_30px_rgba(0,0,0,0.15)] animate-fadeIn">
  <div
    className="absolute inset-0"
    style={{
      backgroundImage: 'url(/images/shopsbycollection-bg.png)',
      backgroundSize: 'contain'
    }}
  />
</div>


      {/* Main Container */}
      <div className="max-w-[1400px] mx-auto py-8 sm:py-10 px-3 sm:px-5">
        <h1 className="text-center text-xs sm:text-sm tracking-[3px] text-gray-600 mb-6 sm:mb-8 font-medium uppercase animate-fadeInUp">
          SHOP BY COLLECTION
        </h1>

        {/* Controls */}
        <div className="flex justify-between items-center mb-6 sm:mb-8 gap-3 sm:gap-5 flex-wrap animate-fadeInUp animation-delay-200">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="flex items-center gap-2.5 py-2.5 sm:py-3 px-4 sm:px-6 bg-white border-2 border-gray-300 rounded-lg cursor-pointer text-xs sm:text-sm font-medium transition-all duration-300 hover:border-[#562D1D] hover:shadow-[0_4px_12px_rgba(205,155,77,0.2)] text-gray-800 font-medium hover:-translate-y-0.5"
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
              className="py-2 px-3 sm:px-4 pr-7 sm:pr-9 border-2 border-gray-300 rounded-lg text-xs sm:text-sm bg-white cursor-pointer text-gray-800 font-medium appearance-none transition-all duration-300 focus:outline-none focus:border-[#562D1D] hover:border-[#562D1D]"
            >
              <option value="best-selling">Best selling</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
              <option value="discount">Discount</option>
            </select>
          </div>
        </div>

 


        {/* Content */}
        <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-6 sm:gap-10">
          {/* Sidebar */}
          <aside
            className={`bg-white p-6 sm:p-8 rounded-xl h-fit shadow-[0_2px_12px_rgba(0,0,0,0.08)] lg:sticky lg:top-5 transition-all duration-300 animate-fadeInUp animation-delay-400 ${
              sidebarOpen ? 'block' : 'hidden lg:block'
            }`}
          >
            <h2 className="text-sm sm:text-base font-semibold mb-5 sm:mb-6 text-gray-800 uppercase tracking-wide">
              Collections
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
                    className={`w-full text-left text-xs sm:text-sm transition-all duration-300 py-2.5 px-3 rounded-lg ${
                      selectedCategory === category.key
                        ? 'text-[#562D1D] bg-gradient-to-r from-[#562D1D]/10 to-[#b8860b]/10 font-semibold pl-5 border-l-4 border-[#562D1D]'
                        : 'text-gray-600 hover:text-[#562D1D] hover:pl-5 hover:bg-gray-50'
                    }`}
                  >
                    {category.name}
                  </button>
                </li>
              ))}
            </ul>

            <div className="mt-7 sm:mt-9 pt-6 sm:pt-8 border-t border-gray-200">
              <h2 className="text-sm sm:text-base font-semibold mb-5 sm:mb-6 text-gray-800 uppercase tracking-wide">
                Price Range
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
                    className="w-full py-2 px-2.5 border-2 border-gray-300 rounded-md text-xs sm:text-sm transition-all duration-300 focus:outline-none text-gray-800 font-medium focus:border-[#562D1D]"
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
                    className="w-full py-2 px-2.5 text-gray-800 font-medium border-2 border-gray-300 rounded-md text-xs sm:text-sm transition-all duration-300 focus:outline-none focus:border-[#562D1D]"
                  />
                </div>
              </div>

              <div className="price-slider relative h-1.5 bg-gray-300 rounded-full my-6 sm:my-8">
                <div
                  className="absolute h-full bg-gradient-to-r from-[#562D1D] to-[#b8860b] rounded-full transition-all duration-200"
                  style={{
                    left: `${minPercent}%`,
                    width: `${maxPercent - minPercent}%`,
                  }}
                />
                <div
                  className="absolute w-4 h-4 sm:w-5 sm:h-5 bg-white border-[3px] border-[#562D1D] rounded-full top-1/2 -translate-y-1/2 cursor-pointer shadow-md z-[2] transition-all duration-200 hover:scale-110 hover:shadow-[0_4px_12px_rgba(205,155,77,0.4)]"
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
                  className="absolute w-4 h-4 sm:w-5 sm:h-5 bg-white border-[3px] border-[#562D1D] rounded-full top-1/2 -translate-y-1/2 cursor-pointer shadow-md z-[2] transition-all duration-200 hover:scale-110 hover:shadow-[0_4px_12px_rgba(205,155,77,0.4)]"
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

          {/* Products */}
          <div>
            <div className="mb-4 sm:mb-6 flex items-center justify-between flex-wrap gap-2">
              <p className="text-xs sm:text-sm text-gray-600">
                Showing{' '}
                <span className="font-semibold text-[#562D1D]">
                  {filteredProducts.length}
                </span>{' '}
                {filteredProducts.length === 1 ? 'product' : 'products'}
                {selectedCategory !== 'all' && (
                  <span className="ml-1.5 sm:ml-2">
                    in{' '}
                    <span className="font-semibold text-gray-800">
                      {
                        categories.find(
                          (c) => c.key === selectedCategory,
                        )?.name
                      }
                    </span>
                  </span>
                )}
              </p>
              {selectedCategory !== 'all' && (
                <button
                  onClick={() => setSelectedCategory('all')}
                  className="text-[11px] sm:text-xs text-[#562D1D] hover:text-[#b8860b] transition-colors duration-300 font-medium underline"
                >
                  Clear Filter
                </button>
              )}
            </div>

            {loading ? (
              <div className="flex flex-col items-center justify-center min-h-[160px] sm:min-h-[200px] gap-3 animate-fadeIn">
                <svg
                  className="animate-spin h-10 w-10 sm:h-12 sm:w-12 text-[#b8860b]"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="#562D1D"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="#b8860b"
                    d="M4 12a8 8 0 018-8v8z"
                  ></path>
                </svg>
                <div className="text-[#b8860b] font-semibold text-base sm:text-lg">
                  Loading products...
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-3 gap-5 sm:gap-6">
                {filteredProducts.map((product, idx) => (
                  <div
                    key={product.id}
                    className="bg-white rounded-2xl overflow-hidden transition-all duration-500 cursor-pointer shadow-[0_4px_20px_rgba(0,0,0,0.08)] hover:-translate-y-3 hover:shadow-[0_20px_40px_rgba(205,155,77,0.25)] animate-fadeInUp group relative border border-gray-100"
                    style={{ animationDelay: `${idx * 50}ms` }}
                    onClick={() => router.push(`/product/${product.id}`)}
                  >
                    {/* Image */}
                    <div className="relative h-56 sm:h-[260px] overflow-hidden bg-gradient-to-br from-gray-50 to-gray-100">
                      <img
                        src={product.main_image || product.image}
                        alt={product.name}
                        className="w-full h-full object-cover transition-all duration-700 group-hover:scale-110 group-hover:rotate-2"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                      {/* Favorite */}
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleFavorite(product.id);
                        }}
                        className={`absolute top-3 sm:top-4 right-3 sm:right-4 w-9 h-9 sm:w-11 sm:h-11 rounded-full border-none cursor-pointer flex items-center justify-center shadow-lg transition-all duration-300 z-[2] hover:scale-125 active:scale-95 ${
                          favorites[product.id]
                            ? 'bg-gradient-to-br from-red-500 to-red-600'
                            : 'bg-white/95 backdrop-blur-md hover:bg-white'
                        }`}
                      >
                        <Heart
                          size={18}
                          className={
                            favorites[product.id]
                              ? 'fill-white stroke-white'
                              : 'fill-none stroke-red-500 group-hover:fill-red-100'
                          }
                          strokeWidth={2.5}
                        />
                      </button>

                      {/* Discount */}
                      <div className="absolute top-3 sm:top-4 left-3 sm:left-4 flex flex-col gap-2">
                        <span className="bg-gradient-to-r from-red-600 via-red-500 to-orange-500 text-white py-1.5 sm:py-2 px-3 sm:px-4 rounded-full font-bold text-[10px] sm:text-xs shadow-[0_4px_15px_rgba(220,38,38,0.4)] backdrop-blur-sm animate-pulse">
                          {product.discount ||
                            Math.round(
                              100 *
                                (1 -
                                  product.price /
                                    (product.originalPrice ||
                                      product.price)),
                            )}
                          % OFF
                        </span>
                      </div>

                      {/* Quick view */}
                      <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-[#562D1D]/95 to-transparent p-3 sm:p-4 translate-y-full group-hover:translate-y-0 transition-transform duration-500">
                        <button className="w-full py-2 sm:py-2.5 bg-white text-[#b8860b] rounded-lg font-semibold text-xs sm:text-sm hover:bg-gray-50 transition-colors duration-300 shadow-md">
                          Quick View
                        </button>
                      </div>
                    </div>

                    {/* Info */}
                    <div className="p-3 sm:p-4">
                      <div className="text-sm text-gray-900 mb-2 leading-snug h-10 sm:h-[40px] overflow-hidden line-clamp-2 font-semibold group-hover:text-[#b8860b] transition-colors duration-300">
                        {product.name}
                      </div>

                      <div className="flex items-baseline gap-1.5 sm:gap-2 mb-2.5 sm:mb-3">
                        <span className="text-lg sm:text-xl font-bold bg-gradient-to-r from-[#562D1D] to-[#b8860b] bg-clip-text text-transparent">
                          ₹{product.price?.toLocaleString()}
                        </span>
                        {product.originalPrice || product.discounted_price ? (
                          <span className="text-[11px] sm:text-xs text-gray-400 line-through font-medium">
                            ₹
                            {(
                              product.originalPrice ||
                              product.discounted_price
                            )?.toLocaleString()}
                          </span>
                        ) : null}
                      </div>

                      <div className="flex items-center justify-between pt-2 border-t border-gray-100">
                        <div className="flex items-center gap-1.5">
                          <div className="flex items-center">
                            {product.rating ? (
                              [...Array(5)].map((_, i) => (
                                <span
                                  key={i}
                                  className={`text-xs sm:text-sm ${
                                    i < Math.floor(product.rating)
                                      ? 'text-yellow-400'
                                      : 'text-gray-300'
                                  }`}
                                >
                                  ★
                                </span>
                              ))
                            ) : (
                              <span className="text-gray-400 text-[11px] sm:text-xs">
                                No ratings yet
                              </span>
                            )}
                          </div>
                          {product.reviews ? (
                            <span className="text-[11px] sm:text-xs text-gray-500 font-medium">
                              ({product.reviews})
                            </span>
                          ) : null}
                        </div>
                        <div className="w-6 h-6 sm:w-7 sm:h-7 rounded-full bg-gradient-to-br from-[#562D1D] to-[#b8860b] flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 cursor-pointer hover:scale-110 active:scale-95">
                          <span className="text-white text-xs sm:text-base font-bold">
                            →
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="absolute top-0 right-0 w-16 sm:w-20 h-16 sm:h-20 bg-gradient-to-br from-[#562D1D]/5 to-transparent rounded-bl-full opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  </div>
                ))}
              </div>
            )}

            {!loading && filteredProducts.length === 0 && (
              <div className="text-center py-16 sm:py-20 animate-fadeIn">
                <div className="text-4xl sm:text-6xl mb-3 sm:mb-4">🔍</div>
                <h3 className="text-xl sm:text-2xl font-semibold text-gray-800 mb-2">
                  No products found
                </h3>
                <p className="text-sm sm:text-base text-gray-600 mb-4">
                  Try adjusting your filters or select a different collection
                </p>
                <button
                  onClick={() => {
                    setSelectedCategory('all');
                    setMinPrice(449);
                    setMaxPrice(7499);
                  }}
                  className="inline-block py-2.5 px-6 bg-gradient-to-r from-[#562D1D] to-[#b8860b] text-white rounded-lg font-medium text-sm sm:text-base transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5"
                >
                  Reset All Filters
                </button>
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
        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(30px);
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
        .animate-fadeIn {
          animation: fadeIn 0.8s ease;
        }
        .animate-slideUp {
          animation: slideUp 0.8s ease;
        }
        .animate-fadeInUp {
          animation: fadeInUp 0.8s ease backwards;
        }
        .animation-delay-200 {
          animation-delay: 0.2s;
        }
        .animation-delay-400 {
          animation-delay: 0.4s;
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

export default ShopByCollection;
