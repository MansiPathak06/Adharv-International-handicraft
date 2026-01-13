'use client';

import React, { useState, useEffect } from 'react';
import { Heart } from 'lucide-react';
import { useRouter } from 'next/navigation';

const LightningCategories = ['All'];

const LightningAccessories = () => {
  const router = useRouter();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentCategory, setCurrentCategory] = useState('All');
  const [currentSort, setCurrentSort] = useState('relevance');
  const [minPrice, setMinPrice] = useState(0);
  const [maxPrice, setMaxPrice] = useState(30000);
  const [favorites, setFavorites] = useState({});
  const [debugInfo, setDebugInfo] = useState(''); // ✅ Debug state

  // ✅ FIXED: Fetch products with proper category filtering
  useEffect(() => {
    async function fetchProducts() {
      setLoading(true);
      try {
        const res = await fetch('http://localhost:5000/api/products');
        
        if (!res.ok) {
          setDebugInfo(`❌ API Error: ${res.status} ${res.statusText}`);
          setLoading(false);
          return;
        }
        
        const data = await res.json();
        const allProducts = data.products || [];

       

        // ✅ Find Lightning products with case-insensitive matching
        const lightningProducts = allProducts.filter((prod) => {
          const category = (prod.category || '').trim().toLowerCase();
          const variations = [
            'lightning',
            'lighting',
            'lightning accessories',
            'lighting accessories'
          ];
          const match = variations.includes(category);

          if (match) {
            console.log('✅ Found Lightning product:', {
              id: prod.id,
              name: prod.name,
              category: prod.category,
              price: prod.price
            });
          }

          return match;
        });

        console.log(`✅ Total Lightning products found: ${lightningProducts.length}`);
        
        setDebugInfo(
          `Found ${lightningProducts.length} Lightning products out of ${allProducts.length} total products`
        );
        
        setProducts(lightningProducts);
      } catch (error) {
        console.error('❌ Fetch error:', error);
        setDebugInfo(`❌ Error: ${error.message}`);
      } finally {
        setLoading(false);
      }
    }
    fetchProducts();
  }, []);

  const getFilteredProducts = () => {
    let filtered = products.filter((product) => {
      const matchesPrice = product.price >= minPrice && product.price <= maxPrice;
      return matchesPrice;
    });

    // Sorting
    if (currentSort === 'price-low') {
      filtered.sort((a, b) => a.price - b.price);
    } else if (currentSort === 'price-high') {
      filtered.sort((a, b) => b.price - a.price);
    } else if (currentSort === 'rating') {
      filtered.sort((a, b) => (b.rating || 0) - (a.rating || 0));
    } else if (currentSort === 'newest') {
      filtered.sort((a, b) => (b.id || 0) - (a.id || 0));
    }

    return filtered;
  };

  const filteredProducts = getFilteredProducts();

  return (
    <div className="bg-white min-h-screen">
      {/* Banner */}
      <section
        className="relative h-[350px] flex items-center justify-center text-white text-center max-md:h-[250px]"
        style={{
          backgroundImage:
            'linear-gradient(rgba(0,0,0,0.4), rgba(0,0,0,0.4)), url(/images/ligtning-accessories-bg.png)',
          backgroundSize: 'contain',
          backgroundPosition: 'center'
        }}
      >
        {/* <div>
          <h1 className="text-5xl font-normal mb-2.5 tracking-wide max-md:text-4xl max-sm:text-[28px]">
            Lightning Accessories
          </h1>
          <p className="text-lg font-light max-sm:text-sm">
            Illuminate your space with elegant lighting solutions
          </p>
        </div> */}
      </section>

      {/* Main Container */}
      <div className="flex max-w-[1400px] mx-auto p-5 gap-5 max-md:flex-col">
        {/* Sidebar */}
        <aside className="w-[250px] flex-shrink-0 max-md:w-full max-md:grid max-md:grid-cols-2 max-md:gap-5 max-sm:grid-cols-1">
          {/* ✅ DEBUG INFO BANNER */}
         

          <div className="mb-8">
            <h3 className="text-[13px] font-semibold text-gray-800 mb-3 uppercase tracking-wide">
              Categories
            </h3>
            <ul className="list-none">
              {LightningCategories.map((category) => (
                <li
                  key={category}
                  onClick={() => setCurrentCategory(category)}
                  className={`py-2 text-sm cursor-pointer transition-colors duration-200 ${
                    currentCategory === category
                      ? 'text-gray-800 font-medium'
                      : 'text-gray-600 hover:text-gray-800'
                  }`}
                >
                  {category === 'All' ? 'All Products' : category}
                </li>
              ))}
            </ul>
          </div>

          <div className="mt-6">
            <h3 className="text-[13px] font-semibold text-gray-800 mb-3 uppercase tracking-wide">
              Price
            </h3>
            <div className="flex gap-2.5 mt-2.5">
              <input
                type="number"
                value={minPrice}
                onChange={(e) => setMinPrice(parseFloat(e.target.value) || 0)}
                placeholder="₹ Min"
                className="w-full py-2 px-2 border border-gray-300 rounded text-gray-800 font-medium text-[13px] focus:outline-none focus:border-gray-800"
              />
              <input
                type="number"
                value={maxPrice}
                onChange={(e) => setMaxPrice(parseFloat(e.target.value) || 30000)}
                placeholder="₹ Max"
                className="w-full py-2 px-2 border border-gray-300 rounded text-[13px] text-gray-800 font-medium focus:outline-none focus:border-gray-800"
              />
            </div>
            <div className="w-full mt-4 h-1 bg-gray-300 rounded-sm relative">
              <div
                className="h-full bg-gray-800 rounded-sm"
                style={{ width: `${(maxPrice / 30000) * 100}%` }}
              />
            </div>
          </div>
        </aside>

        {/* Products Area */}
        <main className="flex-1">
          {/* Toolbar */}
          <div className="flex justify-between items-center mb-5 pb-4 border-b border-gray-200 max-sm:flex-col max-sm:items-start max-sm:gap-3">
            <div className="text-sm text-gray-600">
              {loading
                ? 'Loading lightning accessories...'
                : `Showing ${filteredProducts.length} of ${products.length} ${products.length === 1 ? 'result' : 'results'}`}
            </div>
            <div className="flex items-center gap-2 text-[13px]">
              <label htmlFor="sortSelect">Sort by:</label>
              <select
                id="sortSelect"
                value={currentSort}
                onChange={(e) => setCurrentSort(e.target.value)}
                className="py-1.5 px-2.5 border border-gray-300 rounded text-[13px] cursor-pointer bg-white focus:outline-none focus:border-gray-800"
              >
                <option value="relevance">Relevancy</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="rating">Customer Reviews</option>
                <option value="newest">Newest Arrivals</option>
              </select>
            </div>
          </div>

          {/* Products Grid */}
          <div className="grid grid-cols-4 gap-4 max-xl:grid-cols-3 max-md:grid-cols-2 max-sm:grid-cols-2 max-sm:gap-3">
            {loading ? (
              <div className="col-span-full text-center text-lg py-16 text-amber-600">
                Loading lightning accessories...
              </div>
            ) : filteredProducts.length === 0 ? (
              <div className="col-span-full text-center py-20">
                <div className="text-gray-400 mb-4">
                  <span className="text-6xl">💡</span>
                </div>
                <h3 className="text-2xl font-semibold text-gray-700 mb-2">
                  No products found
                </h3>
                <p className="text-gray-600 mb-4">
                  {products.length === 0
                    ? 'No Lightning products in database'
                    : 'Try adjusting your price range'}
                </p>
                <p className="text-sm text-gray-500">
                  Raw products loaded: {products.length} | After filtering: {filteredProducts.length}
                </p>
              </div>
            ) : (
              filteredProducts.map((product) => (
                <div
                  key={product.id}
                  onClick={() => router.push(`/product/${product.id}`)}
                  className="bg-white cursor-pointer transition-transform duration-200 hover:-translate-y-0.5 group"
                >
                  <div className="relative w-full pb-[100%] overflow-hidden bg-gray-100 rounded-lg">
                    <img
                      src={product.main_image || product.image}
                      alt={product.name}
                      className="absolute top-0 left-0 w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                    />
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setFavorites((prev) => ({
                          ...prev,
                          [product.id]: !prev[product.id]
                        }));
                      }}
                      className="absolute top-2.5 right-2.5 bg-white border-none w-8 h-8 rounded-full cursor-pointer flex items-center justify-center shadow-md opacity-0 transition-opacity duration-200 group-hover:opacity-100"
                    >
                      <Heart
                        size={16}
                        className={
                          favorites[product.id]
                            ? 'fill-red-500 stroke-red-500'
                            : 'fill-none stroke-gray-600'
                        }
                      />
                    </button>

                    {/* Discount Badge */}
                    {(product.discount || (product.originalPrice && product.originalPrice > product.price)) && (
                      <div className="absolute top-2.5 left-2.5 bg-red-500 text-white px-2 py-1 rounded-full text-xs font-bold shadow-md">
                        -{product.discount || Math.round(100 * (1 - (product.price / (product.originalPrice || product.price))))}% OFF
                      </div>
                    )}
                  </div>

                  <div className="py-3">
                    {product.seller && (
                      <div className="text-[11px] text-gray-400 mb-1">
                        {product.seller}
                      </div>
                    )}
                    <div className="text-[13px] text-gray-800 mb-2 leading-snug line-clamp-2 h-9">
                      {product.name}
                    </div>
                    <div className="flex items-center gap-1.5 mb-2">
                      <span className="text-orange-500 text-xs tracking-wide">
                        {'★'.repeat(Math.floor(product.rating || 0))}
                        {'☆'.repeat(5 - Math.floor(product.rating || 0))}
                      </span>
                      <span className="text-xs text-gray-400">
                        ({product.reviews || 0})
                      </span>
                    </div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-base font-semibold text-gray-800">
                        ₹{(product.price || 0).toLocaleString()}
                      </span>
                      {product.originalPrice && (
                        <span className="text-xs text-gray-400 line-through">
                          ₹{product.originalPrice.toLocaleString()}
                        </span>
                      )}
                    </div>
                    <div className="text-[11px] text-green-600 mt-1">
                      FREE shipping
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </main>
      </div>

      {/* CSS for line-clamp */}
      <style jsx>{`
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

export default LightningAccessories;
