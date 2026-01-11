'use client';

import React, { useState, useEffect } from 'react';
import { Heart } from 'lucide-react';
import { useRouter } from 'next/navigation';

const NewLaunches = () => {
  const [products, setProducts] = useState([]);
  const [favorites, setFavorites] = useState({});
  const [minPrice, setMinPrice] = useState(0);
  const [maxPrice, setMaxPrice] = useState(5000);
  const [sortBy, setSortBy] = useState('best-selling');
  const [isDragging, setIsDragging] = useState(false);
  const [currentHandle, setCurrentHandle] = useState(null);
  const [loading, setLoading] = useState(true);

  const absoluteMin = 0;
  const absoluteMax = 10000;
  const router = useRouter();

  useEffect(() => {
    async function fetchProducts() {
      setLoading(true);
      try {
        const res = await fetch('http://localhost:5000/api/products');
        const data = await res.json();
        
        console.log('Products received:', data.products?.length);
        if (data.products && data.products.length > 0) {
          console.log('First product:', data.products[0]);
          console.log('Main image URL:', data.products[0].main_image);
        }
        
        let sortedProducts = (data.products || []).sort(
          (a, b) => (b.id || 0) - (a.id || 0),
        );
        setProducts(sortedProducts);
        
        // ✅ FIX: Set min/max based on actual product prices
        if (sortedProducts.length > 0) {
          const prices = sortedProducts.map((p) => p.price || 0).filter(p => p > 0);
          if (prices.length > 0) {
            const actualMin = Math.min(...prices);
            const actualMax = Math.max(...prices);
            setMinPrice(actualMin);
            setMaxPrice(actualMax);
          }
        }
      } catch (error) {
        console.error('Error fetching products:', error);
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
    let filtered = products.filter(
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
    return filtered.slice(0, 18);
  };

  const minPercent =
    ((minPrice - absoluteMin) / (absoluteMax - absoluteMin)) * 100;
  const maxPercent =
    ((maxPrice - absoluteMin) / (absoluteMax - absoluteMin)) * 100;

  const handleSliderDrag = (e, handle) => {
    if (!isDragging && handle) {
      setIsDragging(true);
      setCurrentHandle(handle);
    }
  };

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

  const filtered = getFilteredProducts();

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
      <div className="max-w-[1400px] mx-auto mt-4 sm:mt-5 overflow-hidden px-3 sm:px-0">
        <div className="relative h-[200px] sm:h-[260px] md:h-[300px] overflow-hidden rounded-lg sm:rounded-none">
          <img
            src="https://i.pinimg.com/1200x/6c/d9/f7/6cd9f7d4b4749e23a3690f4ff220e68d.jpg"
            alt="Festive Collection"
            className="w-full h-full object-cover"
          />
          <div className="absolute top-6 sm:top-10 left-1/2 -translate-x-1/2 text-white text-center px-3">
           <h2
  className="font-[var(--font-playfair)] text-2xl sm:text-3xl md:text-[55px] font-bold mb-1.5 sm:mb-2.5 border-b-2 border-white inline-block pb-1 sm:pb-1.5"
  style={{ textShadow: '2px 2px 4px rgba(0,0,0,0.5)' }}
>
  New Launches
</h2>

<p
  className="font-[var(--font-playfair)] text-md sm:text-md md:text-lg mt-3 leading-relaxed"
  style={{ textShadow: '2px 2px 4px rgba(0,0,0,0.5)' }}
>
  Be the First to Shop <br className="hidden sm:block" />
  our premium Collection.
</p>

          </div>
        </div>
      </div>

      

      {/* Main Container */}
      <div className="max-w-[1400px] mx-auto py-8 sm:py-10 px-3 sm:px-5">
        <h1 className="text-center text-xs sm:text-sm tracking-[3px] text-gray-600 mb-6 sm:mb-8 font-medium uppercase">
          New Launches
        </h1>

       {/* Controls Bar */}
<div className="flex flex-wrap justify-between sm:justify-end items-center mb-6 sm:mb-8 gap-2.5">
  <span className="text-xs text-gray-500 sm:hidden">
    {filtered.length} products
  </span>
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
      className="py-1.5 sm:py-2 px-2.5 sm:px-3 pr-7 sm:pr-8 border border-gray-300 rounded text-xs sm:text-sm text-gray-800 font-medium bg-white cursor-pointer appearance-none bg-[url('data:image/svg+xml,%3Csvg%20xmlns=%27http://www.w3.org/2000/svg%27%20width=%2712%27%20height=%2712%27%20viewBox=%270%200%2012%2012%27%3E%3Cpath%20fill=%27%23333%27%20d=%27M6%209L1%204h10z%27/%3E%3C/svg%3E')] bg-no-repeat bg-[right_8px_center]"
    >
      <option value="best-selling">Best selling</option>
      <option value="price-low">Price: Low to High</option>
      <option value="price-high">Price: High to Low</option>
      <option value="discount">Discount</option>
    </select>
  </div>
</div>


        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-[260px_1fr] gap-6 lg:gap-10">
          {/* Sidebar Filters */}
          <aside className="bg-white p-4 sm:p-6 rounded-lg h-fit shadow-sm order-2 lg:order-1">
            <div className="filter-section">
              <h3 className="text-sm sm:text-base mb-4 sm:mb-5 text-gray-800 font-semibold">
                PRICE
              </h3>
              {/* Price Inputs */}
              <div className="flex gap-3 sm:gap-4 mb-4 sm:mb-5">
                <div className="flex-1">
                  <label
                    htmlFor="minPrice"
                    className="text-[11px] sm:text-xs text-gray-800 block mb-1 font-medium"
                  >
                    Min
                  </label>
                  <input
                    type="number"
                    id="minPrice"
                    value={minPrice}
                    onChange={(e) =>
                      setMinPrice(
                        Math.min(
                          parseInt(e.target.value) || absoluteMin,
                          maxPrice,
                        ),
                      )
                    }
                    className="w-full py-1.5 sm:py-2 px-2 border border-gray-300 rounded text-xs sm:text-sm text-gray-800"
                  />
                </div>
                <div className="flex-1">
                  <label
                    htmlFor="maxPrice"
                    className="text-[11px] sm:text-xs text-gray-800 block mb-1 font-medium"
                  >
                    Max
                  </label>
                  <input
                    type="number"
                    id="maxPrice"
                    value={maxPrice}
                    onChange={(e) =>
                      setMaxPrice(
                        Math.max(
                          parseInt(e.target.value) || absoluteMax,
                          minPrice,
                        ),
                      )
                    }
                    className="w-full py-1.5 sm:py-2 px-2 border border-gray-300 rounded text-xs sm:text-sm text-gray-800"
                  />
                </div>
              </div>
              {/* Price Slider */}
              <div className="price-slider relative h-1.5 bg-gray-300 rounded-full my-4 sm:my-5">
                <div
                  className="absolute h-full bg-[#562D1D] rounded-full"
                  style={{
                    left: `${minPercent}%`,
                    width: `${maxPercent - minPercent}%`,
                  }}
                />
                <div
                  className="absolute w-[16px] sm:w-[18px] h-[16px] sm:h-[18px] bg-[#562D1D] border-[3px] border-white rounded-full top-1/2 -translate-y-1/2 cursor-pointer shadow-md z-[2] hover:scale-110 transition-transform"
                  style={{
                    left: `${minPercent}%`,
                    transform: 'translate(-50%, -50%)',
                  }}
                  onMouseDown={(e) => handleSliderDrag(e, 'min')}
                />
                <div
                  className="absolute w-[16px] sm:w-[18px] h-[16px] sm:h-[18px] bg-[#562D1D] border-[3px] border-white rounded-full top-1/2 -translate-y-1/2 cursor-pointer shadow-md z-[2] hover:scale-110 transition-transform"
                  style={{
                    left: `${maxPercent}%`,
                    transform: 'translate(-50%, -50%)',
                  }}
                  onMouseDown={(e) => handleSliderDrag(e, 'max')}
                />
              </div>
            </div>
          </aside>

          {/* Products Grid */}
          <div className="order-1 lg:order-2">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-3 gap-5 sm:gap-6">
              {loading ? (
                <div className="col-span-full flex justify-center items-center h-[160px] sm:h-[200px] text-[#562D1D] text-base sm:text-xl">
                  Loading new launches...
                </div>
              ) : filtered.length === 0 ? (
                <div className="col-span-full text-center text-lg sm:text-xl text-gray-500 py-10 sm:py-16">
                  No new launch products found.
                </div>
              ) : (
                filtered.map((product) => (
                  <div
                    key={product.id}
                    className="bg-white rounded-lg overflow-hidden transition-all duration-300 cursor-pointer shadow-sm hover:-translate-y-1 hover:shadow-xl"
                    onClick={() => router.push(`/product/${product.id}`)}
                  >
                    <div className="relative h-60 sm:h-[260px] md:h-[280px] overflow-hidden bg-gray-100 group">
                      <img
                        src={product.main_image || '/placeholder.png'}
                        alt={product.name}
                        className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                        loading="lazy"
                        onError={(e) => {
                          console.error('Image failed to load:', product.main_image);
                          console.error('Product ID:', product.id);
                          e.target.src = '/placeholder.png';
                        }}
                      />
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleFavorite(product.id);
                        }}
                        className={`absolute top-3 sm:top-4 right-3 sm:right-4 w-8 h-8 sm:w-9 sm:h-9 rounded-full border-none cursor-pointer flex items-center justify-center shadow-md transition-all duration-300 z-[1] hover:scale-110 ${
                          favorites[product.id] ? 'bg-red-500' : 'bg-white'
                        }`}
                        aria-label="Add to favorites"
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
                    </div>
                    <div className="p-4 sm:p-5">
                      <div className="text-sm sm:text-[15px] text-gray-800 mb-2.5 sm:mb-3 leading-relaxed h-10 sm:h-[45px] overflow-hidden line-clamp-2">
                        {product.name}
                      </div>
                      <div className="flex items-center gap-2.5 flex-wrap">
                        <span className="text-base sm:text-lg font-semibold text-gray-800">
                          ₹{product.price?.toLocaleString()}
                        </span>
                        {(product.originalPrice || product.discounted_price) && (
                          <span className="text-xs sm:text-sm text-gray-400 line-through">
                            ₹
                            {(
                              product.originalPrice ||
                              product.discounted_price
                            )?.toLocaleString()}
                          </span>
                        )}
                        <span className="text-[11px] sm:text-xs text-red-500 font-semibold">
                          {product.discount ||
                            Math.round(
                              100 *
                                (1 -
                                  product.price /
                                    (product.originalPrice ||
                                      product.discounted_price ||
                                      product.price)),
                            )}
                          % off
                        </span>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>

      {/* CTA Banner 2 */}
      <div className="max-w-[1200px] mx-auto mt-10 sm:mt-14 mb-1 px-3 sm:px-0">
        <div
          className="relative overflow-hidden h-40 sm:h-44 flex items-center group cursor-pointer bg-gradient-to-br from-amber-300 via-amber-400 to-orange-400"
          onClick={() => router.push('/gift')}
        >
          <img
            src="https://i.pinimg.com/1200x/ed/39/f9/ed39f95ee36ce739ba149cf56079ae23.jpg"
            alt="Gift Brass Products"
            className="absolute left-0 top-0 w-1/3 sm:w-1/4 h-full object-cover opacity-70 group-hover:opacity-90 transition-opacity duration-300"
          />
          <div className="relative z-10 pl-28 sm:pl-52 pr-4 sm:pr-0">
            <h2 className="text-xl sm:text-3xl font-bold text-amber-900 mb-1.5 sm:mb-2 group-hover:text-white transition-colors">
              Give the Gift of Brass
            </h2>
            <p className="text-sm sm:text-lg text-amber-800 mb-2 sm:mb-3">
              Surprise your loved ones with beautifully crafted brass gifts.
            </p>
            <button className="px-6 sm:px-8 py-2.5 sm:py-3 bg-white text-amber-900 text-sm sm:text-base font-semibold rounded-lg shadow-md hover:bg-amber-700 hover:text-white transition cursor-pointer">
              Explore Gifting
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NewLaunches;
