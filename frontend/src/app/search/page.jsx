"use client";

import React, { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Search, ShoppingCart, Star, ArrowLeft } from "lucide-react";

const SearchPage = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const query = (searchParams.get("query") || "").trim();

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const addToCart = (product) => {
  try {
    const token = localStorage.getItem("token");
    const userEmail = localStorage.getItem("userEmail");

    if (!token || !userEmail) {
      alert("Please login to add items to cart.");
      router.push("/auth");
      return;
    }

    const cartKey = `cartItems:${userEmail.toLowerCase()}`;
    const existing = JSON.parse(localStorage.getItem(cartKey) || "[]");
    const idx = existing.findIndex((i) => i.id === product.id);

    if (idx >= 0) {
      existing[idx].qty += 1;
    } else {
      existing.push({
        id: product.id,
        name: product.name,
        price: product.price,
        image: product.main_image || product.image,
        qty: 1,
      });
    }

    localStorage.setItem(cartKey, JSON.stringify(existing));
    window.dispatchEvent(new Event("cart-updated"));
    alert("Added to cart");
  } catch (err) {
    console.error("addToCart error:", err);
    alert("Could not add to cart. Check console.");
  }
};


  useEffect(() => {
    if (!query) {
      setProducts([]);
      setLoading(false);
      return;
    }

    async function fetchProducts() {
      setLoading(true);
      try {
        const res = await fetch("http://localhost:5000/api/products");
        const data = await res.json();
        const all = data.products || [];
        const q = query.toLowerCase();

        const filtered = all.filter((p) => {
          const name = (p.name || "").toLowerCase();
          const category = (p.category || "").toLowerCase();
          const sub = (p.subcategory || "").toLowerCase();
          return name.includes(q) || category.includes(q) || sub.includes(q);
        });

        setProducts(filtered);
      } catch (err) {
        console.error("Error fetching products for search:", err);
        setProducts([]);
      } finally {
        setLoading(false);
      }
    }

    fetchProducts();
  }, [query]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-red-50 py-10 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header row */}
        <div className="flex items-center justify-between mb-6">
          <button
            onClick={() => router.back()}
            className="flex items-center gap-2 text-sm text-gray-600 hover:text-amber-700"
          >
            <ArrowLeft size={18} />
            Back
          </button>
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <Search size={16} />
            <span>
              Results for{" "}
              <span className="font-semibold text-gray-800">
                “{query || "All"}”
              </span>
            </span>
          </div>
        </div>

        {/* Title */}
        <h1 className="text-2xl md:text-3xl font-bold mb-4 text-gray-900">
          Search Results
        </h1>

        {/* Results */}
        {loading ? (
          <div className="text-center py-16 text-amber-600 text-lg">
            Searching products...
          </div>
        ) : !query ? (
          <div className="text-center py-16 text-gray-500">
            Type something in the search bar to find products.
          </div>
        ) : products.length === 0 ? (
          <div className="text-center py-16">
            <div className="text-6xl mb-3 opacity-30">🔍</div>
            <p className="text-lg text-gray-600 mb-1">No products found</p>
            <p className="text-sm text-gray-500">
              Try a different keyword or browse categories from the menu.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-4">
            {products.map((product) => (
              <div
                key={product.id}
                onClick={() => router.push(`/product/${product.id}`)}
                className="bg-white rounded-2xl shadow-md hover:shadow-2xl transition-all duration-300 overflow-hidden group cursor-pointer"
              >
                <div className="relative overflow-hidden">
                  <img
                    src={product.main_image || product.image}
                    alt={product.name}
                    className="w-full h-64 object-cover transform group-hover:scale-110 transition-transform duration-500"
                  />
                  {product.discount && (
                    <div className="absolute top-4 left-4 bg-red-500 text-white px-3 py-1 rounded-full text-xs font-bold shadow-lg">
                      -{product.discount}%
                    </div>
                  )}
                </div>
                <div className="p-5">
                  <h3 className="text-gray-900 font-semibold mb-2 line-clamp-2">
                    {product.name}
                  </h3>
                  <p className="text-xs text-gray-500 mb-2">
                    {product.category}
                    {product.subcategory ? ` · ${product.subcategory}` : ""}
                  </p>
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
                    <span className="text-xs text-gray-600">
                      {product.rating || 0} ({product.reviews || 0})
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-lg font-bold text-gray-900">
                        ₹{product.price}
                      </span>
                      {product.originalPrice && (
                        <span className="text-xs text-gray-400 line-through">
                          ₹{product.originalPrice}
                        </span>
                      )}
                    </div>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        console.log('ADD CLICKED', product.id);
                        addToCart(product);
                      }}
                      className="px-3 py-2 bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-lg text-xs font-semibold flex items-center gap-1 hover:from-amber-600 hover:to-orange-600"
                    >
                      <ShoppingCart size={14} />
                      Add
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default SearchPage;
