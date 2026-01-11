'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

const DecorativesPage = () => {
  const [decorativeProducts, setDecorativeProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    async function fetchProducts() {
      setLoading(true);
      try {
        const res = await fetch('http://localhost:5000/api/products');
        const data = await res.json();
        const filtered = (data.products || []).filter(
          (p) => (p.category || '').trim().toLowerCase() === 'decoratives',
        );
        setDecorativeProducts(filtered);
      } finally {
        setLoading(false);
      }
    }
    fetchProducts();
  }, []);

  const topDecorativeProducts = decorativeProducts.slice(0, 8);
  const heritageDecorativeProducts = decorativeProducts.slice(8, 12);

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
    {/* Hero Section */}
{/* Hero Section */}
<section className="relative h-[170px] sm:h-[220px] lg:h-[280px] mt-2 overflow-hidden flex items-center justify-center">
  
  {/* Background */}
  <img
    src="/images/bg-image.jpg"
    alt="Decorative Items Hero"
    className="absolute inset-0 w-full h-full object-cover object-center scale-105 transition-transform duration-[5000ms] ease-out hover:scale-110"
  />

  {/* Overlay */}
  <div className="absolute inset-0 bg-gradient-to-r from-[#824f3b]/85 via-[#2b140c]/60 to-[#562D1D]/85 z-10"></div>

  {/* Content */}
  <div className="relative z-20 text-center px-4 animate-fadeIn">

    <h1 className="text-xl sm:text-3xl lg:text-4xl font-light tracking-wide text-white mb-2 leading-tight animate-slideUp">
      Decorate with  
      <span className="block font-bold bg-[#562D1D] bg-clip-text text-transparent drop-shadow-md">
        Elegance & Style
      </span>
    </h1>

    <p className="text-[11px] sm:text-sm lg:text-base text-gray-200 max-w-xl mx-auto mb-4 opacity-90 animate-fadeIn delay-200">
      Premium handcrafted brass décor designed to elevate your living spaces
    </p>

    <button
      onClick={() => router.push('/newlaunches')}
      className="px-5 sm:px-7 py-2 bg-[#562D1D] hover:bg-[#3b1d12] text-white text-xs sm:text-sm font-medium shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 active:scale-95 animate-slideUp delay-300"
    >
      Shop New Launches
    </button>

  </div>
</section>


      {/* CTA BANNER: Home Decor */}
      <div
        className="max-w-[1100px] mx-auto my-8 sm:my-12 rounded-2xl shadow-lg overflow-hidden group relative cursor-pointer px-4 sm:px-0"
        onClick={() => router.push('/furniture')}
      >
        <div className="relative">
          <img
            src="https://i.pinimg.com/736x/f9/9c/80/f99c80f30d0677757127f1967cb0df26.jpg"
            alt="Brass Home Decor"
            className="w-full h-40 sm:h-52 object-cover group-hover:opacity-80 transition-opacity duration-400"
          />
          <div className="absolute inset-0 z-10 flex flex-col items-start justify-center px-6 sm:px-12 bg-gradient-to-l from-transparent via-black/30 to-black/60">
            <h3 className="text-xl sm:text-3xl font-bold text-white mb-1 sm:mb-2 animate-slideRight">
              Elevate Your Home With Brass
            </h3>
            <p className="text-sm sm:text-lg text-white opacity-90 mb-2 sm:mb-3 transition">
              Discover unique home decor pieces hand-crafted to impress.
            </p>
            <button className="text-xs sm:text-base text-amber-900 px-5 sm:px-8 py-2 rounded-lg font-bold bg-white/90 shadow hover:bg-amber-900 hover:text-white transition animate-fadeIn cursor-pointer">
              Shop beautiful furniture pieces!
            </button>
          </div>
        </div>
      </div>

      {/* Decoratives Section - 8 Products */}
      <section className="bg-[#fefefe] py-14 sm:py-20 px-4 sm:px-5 text-center animate-fadeIn">
        <h2 className="text-2xl sm:text-3xl lg:text-[42px] text-[#2c5f6f] mb-3 sm:mb-5 font-normal animate-slideDown">
          Decoratives that define spaces
        </h2>
        <p className="text-sm sm:text-base text-gray-600 max-w-[800px] mx-auto mb-6 sm:mb-8 leading-relaxed animate-slideUp">
          With our decoratives — beauty isn&apos;t just placed in corners
          <br className="hidden sm:block" />
          — it transforms every space into a masterpiece.
        </p>

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
              Loading decorative products...
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8 max-w-[1400px] mx-auto px-1 sm:px-5 mt-4 sm:mt-5">
            {topDecorativeProducts.length === 0 && (
              <div className="col-span-full text-center text-lg sm:text-xl text-gray-500 py-10 sm:py-16">
                No decorative products found.
              </div>
            )}
            {topDecorativeProducts.map((product) => (
              <div
                key={product.id}
                className="relative rounded-[20px] overflow-hidden bg-white shadow-[0_10px_30px_rgba(0,0,0,0.1)] transition-all duration-300 hover:-translate-y-2.5 hover:shadow-[0_20px_50px_rgba(0,0,0,0.15)] cursor-pointer group"
                onClick={() => router.push(`/product/${product.id}`)}
              >
                <div
                  className="relative h-64 sm:h-[350px] flex items-center justify-center overflow-hidden border-[6px] border-transparent animate-shimmer group"
                  style={{
                    backgroundImage: `linear-gradient(rgba(44, 62, 80, 0.2), rgba(44, 62, 80, 0.2)), url('${
                      product.main_image || product.image
                    }')`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                  }}
                >
                  <div className="absolute w-full h-full bg-[radial-gradient(circle_at_30%_30%,rgba(255,215,0,0.16)_0%,transparent_60%)] pointer-events-none group-hover:bg-[radial-gradient(circle_at_60%_60%,rgba(255,215,0,0.22)_0%,transparent_80%)] duration-300" />
                  <div
                    className="absolute w-1 h-1 bg-[#FFD700] rounded-full animate-sparkle z-10"
                    style={{ top: '20%', left: '30%', animationDelay: '0s' }}
                  />
                  <div
                    className="absolute w-1 h-1 bg-[#FFD700] rounded-full animate-sparkle z-10"
                    style={{ top: '60%', right: '25%', animationDelay: '0.5s' }}
                  />
                </div>
                <div className="p-4 sm:p-5 text-center">
                  <h3 className="text-base sm:text-lg text-[#2c3e50] font-medium min-h-[44px] sm:min-h-[50px]">
                    {product.name}
                  </h3>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Heritage Section */}
      <section className="bg-gradient-to-br from-[#6B3410] to-[#8B4513] py-14 sm:py-20 px-4 sm:px-5 animate-slideUp">
        <div className="max-w-[1400px] mx-auto">
          <div className="grid md:grid-cols-2 gap-8 sm:gap-10 items-center mb-10 sm:mb-16">
            <div className="text-white px-2 sm:px-0 sm:p-10">
              <h1 className="text-3xl sm:text-4xl lg:text-5xl mb-4 sm:mb-8 font-normal leading-tight animate-fadeIn">
                Crafted by Hand,
                <br />
                Inspired by Heritage
              </h1>
              <p className="text-base sm:text-lg mb-5 sm:mb-8 opacity-90">
                India&apos;s Timeless Artistry
              </p>
              <button
                onClick={() => router.push('/shopsbycollection')}
                className="inline-block py-3 sm:py-4 px-7 sm:px-10 border-2 border-amber-400 text-white font-bold no-underline rounded transition-all duration-300 text-sm sm:text-base bg-amber-400/20 hover:bg-amber-400 hover:text-[#8B4513] animate-bounceIn"
              >
                Explore All Collections
              </button>
            </div>
            <div
              className="h-64 sm:h-[400px] lg:h-[500px] rounded-[20px] shadow-[0_15px_45px_rgba(0,0,0,0.4)] animate-slideRight"
              style={{
                backgroundImage:
                  "url('https://i.pinimg.com/1200x/da/8a/26/da8a26ff6914e5fdee10324c76fec48d.jpg')",
                backgroundSize: 'cover',
                backgroundPosition: 'center',
              }}
            />
          </div>

          {!loading && heritageDecorativeProducts.length > 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8 mb-8 sm:mb-10 animate-slideDown">
              {heritageDecorativeProducts.map((product) => (
                <div
                  key={product.id}
                  className="relative rounded-[20px] overflow-hidden shadow-[0_10px_30px_rgba(0,0,0,0.3)] transition-all duration-300 bg-white hover:-translate-y-2.5 hover:shadow-[0_20px_50px_rgba(0,0,0,0.4)] cursor-pointer group"
                  onClick={() => router.push(`/product/${product.id}`)}
                >
                  <div
                    className="relative h-64 sm:h-[350px] flex items-center justify-center overflow-hidden animate-shimmer"
                    style={{
                      backgroundImage: `url('${
                        product.main_image || product.image
                      }')`,
                      backgroundSize: 'cover',
                      backgroundPosition: 'center',
                    }}
                  />
                  <div className="p-4 sm:p-5 text-center">
                    <h3 className="text-base sm:text-lg text-[#2c3e50] font-medium min-h-[44px] sm:min-h-[50px]">
                      {product.name}
                    </h3>
                  </div>
                </div>
              ))}
            </div>
          )}

          <div className="text-center mt-8 sm:mt-10 animate-fadeIn">
            <Link
              href="/decoratives"
              className="inline-block py-3 sm:py-4 px-8 sm:px-10 border-2 border-white text-white no-underline rounded transition-all duration-300 text-sm sm:text-base hover:bg-white hover:text-[#6B3410] font-semibold shadow-md"
            >
              View All Decorative Items
            </Link>
          </div>
        </div>
      </section>

      {/* Corporate Section */}
      <section className="bg-gradient-to-br from-gray-50 to-gray-200 py-14 sm:py-20 px-4 sm:px-5 max-w-[1400px] mx-auto grid md:grid-cols-2 gap-10 md:gap-14 items-center animate-fadeIn">
        <div
          className="h-64 sm:h-[380px] lg:h-[450px] rounded-full shadow-[0_15px_45px_rgba(0,0,0,0.15)] animate-slideLeft"
          style={{
            backgroundImage:
              "url('https://images.unsplash.com/photo-1549465220-1a8b9238cd48?w=500&h=500&fit=crop')",
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        />
        <div>
          <h2 className="text-2xl sm:text-3xl lg:text-[42px] text-[#2c5f6f] mb-4 sm:mb-8 font-normal animate-slideRight">
            Corporate Decoratives
          </h2>
          <p className="text-sm sm:text-base text-gray-600 leading-relaxed mb-6 sm:mb-8">
            Sophistication shouldn&apos;t fade with trends. When you choose
            meaningful, well-crafted decoratives, you&apos;re not just filling spaces,
            you&apos;re creating an environment that inspires. Because true
            elegance isn&apos;t temporary — it&apos;s wrapped in timeless
            design, quality, and the impression that lasts.
          </p>
          <Link
            href="#"
            className="inline-block py-3 sm:py-4 px-8 sm:px-10 border-2 border-[#CD853F] text-[#CD853F] no-underline rounded transition-all duration-300 text-sm sm:text-base hover:bg-[#CD853F] hover:text-white font-semibold shadow"
          >
            CONTACT US
          </Link>
        </div>
      </section>

      {/* Features Section */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-10 max-w-[1400px] mx-auto py-10 sm:py-16 px-4 sm:px-5 bg-gray-50 animate-fadeIn">
        <div className="flex items-center gap-4 sm:gap-5">
          <div className="w-14 h-14 sm:w-15 sm:h-15 bg-gradient-to-br from-[#FFD700] to-[#FFA500] rounded-full flex items-center justify-center text-xl sm:text-2xl shrink-0">
            🇮🇳
          </div>
          <div className="text-sm sm:text-base text-[#2c3e50] font-medium">
            Free Delivery Across India
          </div>
        </div>
        <div className="flex items-center gap-4 sm:gap-5">
          <div className="w-14 h-14 sm:w-15 sm:h-15 bg-gradient-to-br from-[#FFD700] to-[#FFA500] rounded-full flex items-center justify-center text-xl sm:text-2xl shrink-0">
            ✋
          </div>
          <div className="text-sm sm:text-base text-[#2c3e50] font-medium">
            100% Hand-crafted
          </div>
        </div>
        <div className="flex items-center gap-4 sm:gap-5">
          <div className="w-14 h-14 sm:w-15 sm:h-15 bg-gradient-to-br from-[#FFD700] to-[#FFA500] rounded-full flex items-center justify-center text-xl sm:text-2xl shrink-0">
            💵
          </div>
          <div className="text-sm sm:text-base text-[#2c3e50] font-medium">
            COD Available
          </div>
        </div>
        <div className="flex items-center gap-4 sm:gap-5">
          <div className="w-14 h-14 sm:w-15 sm:h-15 bg-gradient-to-br from-[#FFD700] to-[#FFA500] rounded-full flex items-center justify-center text-xl sm:text-2xl shrink-0">
            📦
          </div>
          <div className="text-sm sm:text-base text-[#2c3e50] font-medium">
            Easy Returns
          </div>
        </div>
      </section>

      <style jsx>{`
        @keyframes shimmer {
          0%,
          100% {
            filter: brightness(1);
          }
          50% {
            filter: brightness(1.13);
          }
        }
        @keyframes sparkle {
          0%,
          100% {
            opacity: 0;
            transform: scale(0);
          }
          50% {
            opacity: 1;
            transform: scale(1.5);
          }
        }
        @keyframes slideDown {
          0% {
            opacity: 0;
            transform: translateY(-40px);
          }
          100% {
            opacity: 1;
            transform: translateY(0);
          }
        }
        @keyframes slideUp {
          0% {
            opacity: 0;
            transform: translateY(40px);
          }
          100% {
            opacity: 1;
            transform: translateY(0);
          }
        }
        @keyframes slideRight {
          0% {
            opacity: 0;
            transform: translateX(-40px);
          }
          100% {
            opacity: 1;
            transform: translateX(0);
          }
        }
        @keyframes slideLeft {
          0% {
            opacity: 0;
            transform: translateX(40px);
          }
          100% {
            opacity: 1;
            transform: translateX(0);
          }
        }
        @keyframes fadeIn {
          0% {
            opacity: 0;
          }
          100% {
            opacity: 1;
          }
        }
        .animate-fadeIn {
          animation: fadeIn 1.2s both;
        }
        .animate-slideDown {
          animation: slideDown 1.1s;
        }
        .animate-slideUp {
          animation: slideUp 0.9s;
        }
        .animate-slideRight {
          animation: slideRight 1.3s;
        }
        .animate-slideLeft {
          animation: slideLeft 1.3s;
        }
        .animate-shimmer {
          animation: shimmer 2s infinite;
        }
        .animate-sparkle {
          animation: sparkle 2.5s infinite;
        }
        .animate-bounceIn {
          animation: bounceIn 1.3s;
        }
        @keyframes bounceIn {
          0% {
            opacity: 0;
            transform: scale(0.8);
          }
          60% {
            opacity: 0.9;
            transform: scale(1.07);
          }
          80% {
            opacity: 1;
            transform: scale(0.98);
          }
          100% {
            opacity: 1;
            transform: scale(1);
          }
        }
      `}</style>
    </div>
  );
};

export default DecorativesPage;
