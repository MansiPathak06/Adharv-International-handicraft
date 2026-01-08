'use client';
import React, { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { Heart, Share2, ShoppingCart, Star, Truck, Shield, RotateCcw, Sparkles, Award, Clock } from 'lucide-react';

const ProductDetails = () => {
  const router = useRouter();
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [related, setRelated] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [isInStock, setIsInStock] = useState(true);
  const [isLiked, setIsLiked] = useState(false);
  const [addedMsg, setAddedMsg] = useState('');

  // ✅ ADD THIS HELPER FUNCTION AT THE TOP
  const getImageUrl = (img) => {
    if (!img) return null;
    return img.startsWith('http') ? img : `http://localhost:5000/${img}`;
  };

useEffect(() => {
  if (!id) return;
  async function fetchData() {
    setLoading(true);
    const res = await fetch('http://localhost:5000/api/products');
    const data = await res.json();
    const prod = data.products.find(p => String(p.id) === String(id));
    setProduct(prod);
    if (prod) {
      // ✅ ADD THIS LINE - Check stock status
      setIsInStock(prod.stock === 1 || prod.stock === true);
      
      setSelectedImage(getImageUrl(prod.main_image || prod.image));
      const relatedArr = data.products
        .filter(
          p =>
            p.id !== prod.id &&
            (p.category === prod.category ||
              (p.subcategory && prod.subcategory && p.subcategory === prod.subcategory))
        )
        .slice(0, 4);
      setRelated(relatedArr);
    }
    setLoading(false);
  }
  fetchData();
}, [id]);

  if (loading || !product) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50">
        <div className="text-center">
          <div className="relative">
            <div className="animate-spin rounded-full h-20 w-20 border-t-4 border-b-4 border-[#562D1D] mx-auto"></div>
            <div className="absolute inset-0 animate-ping rounded-full h-20 w-20 border-4 border-[#562D1D] opacity-20 mx-auto"></div>
          </div>
          <p className="mt-6 text-lg font-semibold text-gray-700">Loading luxury experience...</p>
        </div>
      </div>
    );
  }

  // ✅ UPDATE THIS ARRAY
  const allImages = [
    getImageUrl(product.main_image || product.image),
    getImageUrl(product.sub_image_1),
    getImageUrl(product.sub_image_2),
    getImageUrl(product.sub_image_3)
  ].filter(Boolean);

const handleAddToCart = () => {
  // ✅ ADD THIS STOCK CHECK AT THE TOP
  if (!isInStock) {
    setAddedMsg('⚠️ This product is currently out of stock');
    setTimeout(() => setAddedMsg(''), 2000);
    return;
  }

  const token = localStorage.getItem('token');
  const userEmail = localStorage.getItem('userEmail');

  if (!token || !userEmail) {
    setAddedMsg('Please login first to add items to cart.');
    setTimeout(() => {
      setAddedMsg('');
      router.push('/auth');
    }, 1500);
    return;
  }

  const cartKey = `cartItems:${userEmail.toLowerCase()}`;
  const existing = JSON.parse(localStorage.getItem(cartKey) || '[]');
  const idx = existing.findIndex(i => i.id === product.id);

  if (idx >= 0) {
    existing[idx].qty += quantity;
  } else {
    existing.push({
      id: product.id,
      name: product.name,
      price: product.price,
      image: getImageUrl(product.main_image || product.image),
      qty: quantity,
      stock: product.stock, // ✅ ADD THIS - Store stock status
    });
  }

  localStorage.setItem(cartKey, JSON.stringify(existing));
  window.dispatchEvent(new Event('cart-updated'));
  setAddedMsg('Added to cart!');
  setTimeout(() => setAddedMsg(''), 2000);
};


  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-amber-50 to-yellow-50 relative overflow-hidden">
      {/* ... rest of your decorative elements ... */}
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12 relative z-10">
        <div className="bg-white/90 backdrop-blur-sm rounded-3xl shadow-2xl overflow-hidden border border-[#562D1D]/20">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 p-6 lg:p-10">
            {/* Image side - NO CHANGES NEEDED HERE, selectedImage already has full URL */}
            <div className="space-y-4">
              <div className="relative group">
                <div className="absolute inset-0 bg-gradient-to-br from-[#562D1D]/20 to-amber-200/20 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <div className="relative aspect-square bg-gradient-to-br from-gray-50 to-amber-50/30 rounded-2xl overflow-hidden border-2 border-[#562D1D]/30 shadow-lg">
                  <img
                    src={selectedImage}
                    alt={product.name}
                    className="w-full h-full object-contain p-8 transform transition-transform duration-700 group-hover:scale-110"
                  />
                  <div className="absolute top-4 right-4 bg-gradient-to-br from-[#562D1D] to-[#b8860b] text-white px-3 py-1 rounded-full text-xs font-bold shadow-lg flex items-center gap-1">
                    <Sparkles className="w-3 h-3" />
                    Premium
                  </div>
                </div>
              </div>
              {allImages.length > 1 && (
                <div className="grid grid-cols-4 gap-3">
                  {allImages.map((img, i) => (
                    <div
                      key={i}
                      onClick={() => setSelectedImage(img)}
                      className={`aspect-square bg-gradient-to-br from-gray-50 to-amber-50/30 rounded-xl overflow-hidden border-2 cursor-pointer transform transition-all duration-300 hover:scale-105 hover:shadow-lg ${
                        selectedImage === img
                          ? 'border-[#562D1D] ring-4 ring-[#562D1D]/30 shadow-lg'
                          : 'border-gray-200 hover:border-[#562D1D]/50'
                      }`}
                    >
                      <img src={img} alt={`View ${i + 1}`} className="w-full h-full object-contain p-2" />
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Info side */}
            <div className="flex flex-col space-y-6">
              <div className="space-y-3">
                {product.category && (
                  <span className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-[#562D1D] to-[#b8860b] text-white rounded-full text-sm font-bold shadow-md">
                    <Award className="w-4 h-4" />
                    {product.category}
                  </span>
                )}
                <h1 className="text-3xl lg:text-4xl font-bold bg-gradient-to-r from-gray-900 via-[#562D1D] to-gray-900 bg-clip-text text-transparent leading-tight">
                  {product.name}
                </h1>

                {product.rating && (
                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-1 bg-amber-50 px-3 py-1 rounded-full">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`w-4 h-4 ${
                            i < Math.floor(product.rating)
                              ? "fill-yellow-400 text-yellow-400"
                              : "text-gray-300"
                          }`}
                        />
                      ))}
                    </div>
                    <span className="text-gray-700 font-bold">
                      {product.rating}
                    </span>
                    {product.reviews && (
                      <span className="text-gray-500">
                        ({product.reviews} reviews)
                      </span>
                    )}
                  </div>
                )}
              </div>

              {/* Price */}
              <div className="bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50 rounded-2xl p-5 border-2 border-[#562D1D]/40 shadow-lg">
                <div className="flex flex-wrap items-end gap-3">
                  <span className="text-3xl font-bold bg-gradient-to-r from-[#562D1D] to-[#b8860b] bg-clip-text text-transparent">
                    ₹{product.price}
                  </span>
                  {(product.originalPrice || product.discounted_price) && (
                    <>
                      <span className="text-xl line-through text-gray-400">
                        ₹{product.originalPrice || product.discounted_price}
                      </span>
                      {product.discount && (
                        <span className="bg-gradient-to-r from-green-500 to-emerald-600 text-white px-4 py-1 rounded-full text-sm font-bold shadow-md animate-pulse">
                          Save {product.discount}%
                        </span>
                      )}
                    </>
                  )}
                </div>
              </div>

              {product.short_desc && (
                <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-5 border border-blue-200 shadow-md">
                  <p className="text-gray-700 leading-relaxed font-medium">
                    {product.short_desc}
                  </p>
                </div>
              )}
              {/* ✅ ADD THIS STOCK STATUS BADGE */}
<div className="flex items-center gap-3 py-3">
  {isInStock ? (
    <div className="flex items-center gap-2 bg-gradient-to-r from-green-50 to-emerald-50 px-4 py-2 rounded-xl border-2 border-green-300 shadow-md">
      <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse shadow-lg shadow-green-300"></div>
      <span className="text-green-700 font-bold text-sm">In Stock</span>
    </div>
  ) : (
    <div className="flex items-center gap-2 bg-gradient-to-r from-red-50 to-pink-50 px-4 py-2 rounded-xl border-2 border-red-300 shadow-md">
      <div className="w-3 h-3 bg-red-500 rounded-full"></div>
      <span className="text-red-700 font-bold text-sm">Out of Stock</span>
    </div>
  )}
</div>


              <div className="flex items-center gap-4">
                <span className="font-bold text-gray-800">Quantity:</span>
                <div className="flex items-center border-2 border-[#562D1D]/40 rounded-xl overflow-hidden shadow-md bg-white">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="px-5 py-3 bg-gradient-to-br from-gray-50 to-amber-50 hover:from-[#562D1D]/10 hover:to-[#b8860b]/10 transition-all duration-200 font-bold text-gray-700"
                  >
                    -
                  </button>
                  <span className="px-8 py-3 font-bold text-gray-900 bg-gradient-to-r from-amber-50 to-orange-50">
                    {quantity}
                  </span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="px-5 py-3 bg-gradient-to-br from-gray-50 to-amber-50 hover:from-[#562D1D]/10 hover:to-[#b8860b]/10 transition-all duration-200 font-bold text-gray-700"
                  >
                    +
                  </button>
                </div>
              </div>

              <div className="flex gap-3">
                <button
  disabled={!isInStock} // ✅ ADD THIS
  className={`flex-1 py-4 rounded-xl font-bold text-lg shadow-xl transform transition-all duration-300 flex items-center justify-center gap-2 relative overflow-hidden group ${
    isInStock
      ? 'bg-gradient-to-r from-[#562D1D] via-[#d4a558] to-[#b8860b] text-white hover:shadow-2xl hover:scale-105 active:scale-95 cursor-pointer'
      : 'bg-gray-300 text-gray-500 cursor-not-allowed opacity-60'
  }`} // ✅ UPDATED THIS
  onClick={handleAddToCart}
>
  {isInStock && ( // ✅ ADD THIS CONDITION
    <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 transform -skew-x-12 translate-x-[-100%] group-hover:translate-x-[200%] transition-transform duration-700"></div>
  )}
  <ShoppingCart className="w-5 h-5 relative z-10" />
  <span className="relative z-10">
    {isInStock ? 'Add to Cart' : 'Out of Stock'} {/* ✅ UPDATED THIS */}
  </span>
</button>

                <button
                  className="px-6 py-4 border-2 border-[#562D1D] text-[#562D1D] rounded-xl font-bold hover:bg-gradient-to-r hover:from-[#562D1D] hover:to-[#b8860b] hover:text-white transition-all duration-300 transform hover:scale-105 active:scale-95 shadow-lg hover:shadow-xl"
                  onClick={() => router.push("/cart")}
                >
                  Go to Cart
                </button>
              </div>
              {addedMsg && (
                <div className="text-green-600 text-center text-sm font-bold bg-green-50 py-2 rounded-lg border border-green-200 animate-pulse">
                  {addedMsg}
                </div>
              )}

              {/* Features */}
              <div className="grid grid-cols-3 gap-3 pt-4">
                <div className="text-center p-4 bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl border-2 border-green-200 shadow-md transform transition-all duration-300 hover:scale-105 hover:shadow-lg">
                  <Truck className="w-7 h-7 mx-auto mb-2 text-green-600" />
                  <p className="text-xs font-bold text-gray-800">
                    Free Delivery
                  </p>
                </div>
                <div className="text-center p-4 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl border-2 border-blue-200 shadow-md transform transition-all duration-300 hover:scale-105 hover:shadow-lg">
                  <Shield className="w-7 h-7 mx-auto mb-2 text-blue-600" />
                  <p className="text-xs font-bold text-gray-800">
                    Secure Payment
                  </p>
                </div>
                <div className="text-center p-4 bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl border-2 border-purple-200 shadow-md transform transition-all duration-300 hover:scale-105 hover:shadow-lg">
                  <RotateCcw className="w-7 h-7 mx-auto mb-2 text-purple-600" />
                  <p className="text-xs font-bold text-gray-800">
                    Easy Returns
                  </p>
                </div>
              </div>
            </div>
          </div>

          {product.description && (
            <div className="border-t-2 border-[#562D1D]/20 p-6 lg:p-10 bg-gradient-to-b from-white to-amber-50/30">
              <h2 className="text-2xl font-bold mb-4 bg-gradient-to-r from-gray-900 to-[#562D1D] bg-clip-text text-transparent flex items-center gap-2">
                <Sparkles className="w-6 h-6 text-[#562D1D]" />
                Product Description
              </h2>
              <p className="text-gray-700 leading-relaxed whitespace-pre-line font-medium">
                {product.description}
              </p>
            </div>
          )}
        </div>

        {/* Enhanced Related Products Section */}
        {related.length > 0 && (
          <div className="mt-16">
            <div className="text-center mb-10">
              <div className="inline-flex items-center gap-3 bg-gradient-to-r from-[#562D1D] to-[#b8860b] text-white px-6 py-3 rounded-full shadow-xl mb-4">
                <Sparkles className="w-5 h-5" />
                <span className="font-bold text-lg">Curated For You</span>
                <Sparkles className="w-5 h-5" />
              </div>
              <h2 className="text-4xl font-bold bg-gradient-to-r from-gray-900 via-[#562D1D] to-gray-900 bg-clip-text text-transparent mb-2">
                You May Also Like
              </h2>
              <p className="text-gray-600 font-medium">
                Handpicked luxury selections just for you
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {related.map((rp, index) => (
                <div
                  key={rp.id}
                  onClick={() => router.push(`/product/${rp.id}`)}
                  className="group relative bg-gradient-to-br from-white via-amber-50/30 to-orange-50/40 rounded-3xl overflow-hidden shadow-2xl hover:shadow-[0_20px_60px_rgba(205,155,77,0.4)] cursor-pointer transform transition-all duration-500 hover:-translate-y-4 border-2 border-[#562D1D]/40 hover:border-[#562D1D] aspect-square"
                  style={{ 
                    animationDelay: `${index * 100}ms`,
                    animation: 'fadeInUp 0.6s ease-out forwards',
                    opacity: 0
                  }}
                >
                  {/* Animated gradient background */}
                  <div className="absolute inset-0 bg-gradient-to-br from-[#562D1D]/5 via-amber-100/10 to-orange-100/10 opacity-100"></div>

                  {/* Decorative circles */}
                  <div className="absolute -top-12 -right-12 w-32 h-32 bg-gradient-to-br from-[#562D1D]/20 to-transparent rounded-full blur-2xl"></div>
                  <div className="absolute -bottom-12 -left-12 w-32 h-32 bg-gradient-to-tr from-orange-300/20 to-transparent rounded-full blur-2xl"></div>

                  {/* Luxury badge */}
                  <div className="absolute top-3 right-3 bg-gradient-to-br from-[#562D1D] via-[#d4a558] to-[#b8860b] text-white px-3 py-1.5 rounded-full text-xs font-bold shadow-xl z-20 flex items-center gap-1 animate-pulse">
                    <Sparkles className="w-3 h-3" />
                    <span>Premium</span>
                  </div>

                  {/* Decorative corner accent - always visible */}
                  <div className="absolute top-0 left-0 w-20 h-20 bg-gradient-to-br from-[#562D1D]/30 via-[#d4a558]/20 to-transparent transition-all duration-500 group-hover:w-24 group-hover:h-24"></div>

                  {/* Golden frame effect */}
                  <div className="absolute inset-0 border-2 border-transparent group-hover:border-[#562D1D]/30 rounded-3xl m-2 transition-all duration-500"></div>

                  {/* Content wrapper */}
                  <div className="relative h-full flex flex-col z-10">
                    {/* Image container with golden glow - LARGER */}
                   {/* Image container */}
    <div className="relative p-4 overflow-hidden" style={{ height: "75%" }}>
      <div className="relative w-full h-full rounded-2xl overflow-hidden bg-white/50 backdrop-blur-sm shadow-lg">
        <img
          src={getImageUrl(rp.main_image || rp.image)}
          alt={rp.name}
          className="w-full h-full object-contain p-3 transform transition-all duration-700 group-hover:scale-110 drop-shadow-2xl"
        />
        
        {/* ✅ ADD THIS OUT OF STOCK OVERLAY */}
        {(rp.stock === 0 || rp.stock === false) && (
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center">
            <div className="bg-red-500 text-white px-4 py-2 rounded-full font-bold text-sm shadow-xl">
              Out of Stock
            </div>
          </div>
        )}
      </div>
    </div>

                    {/* Info section with glass effect - SMALLER */}
                    <div
                      className="relative p-3 bg-white/80 backdrop-blur-md border-t-2 border-[#562D1D]/30 shadow-lg"
                      style={{ height: "25%" }}
                    >
                      {/* Decorative line */}
                      <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-12 h-0.5 bg-gradient-to-r from-transparent via-[#562D1D] to-transparent rounded-full"></div>

                      <h3 className="font-bold text-sm text-gray-900 mb-2 line-clamp-1 group-hover:text-[#562D1D] transition-colors duration-300 text-center">
                        {rp.name}
                      </h3>

                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xl font-bold bg-gradient-to-r from-[#562D1D] via-[#d4a558] to-[#b8860b] bg-clip-text text-transparent">
                          ₹{rp.price}
                        </span>
                        {rp.rating && (
                          <div className="flex items-center gap-1 bg-gradient-to-r from-amber-100 to-yellow-100 px-2 py-1 rounded-full border border-yellow-300 shadow-md">
                            <Star className="w-3 h-3 fill-yellow-500 text-yellow-500" />
                            <span className="text-xs font-bold text-gray-800">
                              {rp.rating}
                            </span>
                          </div>
                        )}
                      </div>

                      {/* View Details button - compact */}
                      <button className="w-full bg-gradient-to-r from-[#562D1D] via-[#d4a558] to-[#b8860b] text-white py-2 rounded-xl font-bold text-xs shadow-lg hover:shadow-xl transform transition-all duration-300 hover:scale-105 flex items-center justify-center gap-1">
                        <span>Quick View</span>
                        <Sparkles className="w-3 h-3" />
                      </button>
                    </div>
                  </div>

                  {/* Shimmer effect on hover */}
                  <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none z-30">
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent transform -skew-x-12 translate-x-[-200%] group-hover:translate-x-[200%] transition-transform duration-1000"></div>
                  </div>

                  {/* Bottom golden accent line - always visible */}
                  <div className="absolute bottom-0 left-0 right-0 h-1.5 bg-gradient-to-r from-[#562D1D] via-[#d4a558] to-[#b8860b] shadow-lg"></div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

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
      `}</style>
    </div>
  );
};

export default ProductDetails;
