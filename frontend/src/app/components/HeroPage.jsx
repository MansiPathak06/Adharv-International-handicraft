"use client";

import Link from "next/link";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Star, TrendingUp } from "lucide-react";

const HomePage = () => {
  const router = useRouter();
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  const [bestSellers, setBestSellers] = useState([]);
  const [loadingSellers, setLoadingSellers] = useState(true);

  const [premiumProducts, setPremiumProducts] = useState([]);
  const [loadingPremium, setLoadingPremium] = useState(true);

const slides = [
  {
    image: "/images/slide1.jpg",
    title: "Garden Accessories & Fences",
    subtitle: "Enhance Your Outdoor Spaces with Style",
    cta: "Explore Garden Decor",
    href: "/garden-accessories",
  },
  {
    image: "/images/slide2.jpg",
    title: "Decorative Table Tops",
    subtitle: "Elegant Accents for Every Corner",
    cta: "Shop Table Decor",
    href: "/table-tops",
  },
  {
    image: "/images/slide3.jpg",
    title: "Lighting & Candle Stands",
    subtitle: "Create a Warm and Inviting Ambience",
    cta: "Explore Lighting",
    href: "/lightning",
  },
  {
    image: "/images/slide4.jpg",
    title: "Kitchenware, Furniture & Artifacts",
    subtitle: "Functional Craftsmanship with Timeless Beauty",
    cta: "View Collections",
    href: "/housewares",
  },
];


  useEffect(() => {
    if (!isPaused) {
      const interval = setInterval(() => {
        setCurrentSlide((prev) => (prev + 1) % slides.length);
      }, 5000);
      return () => clearInterval(interval);
    }
  }, [isPaused, slides.length]);

  const changeSlide = (direction) => {
    setCurrentSlide((prev) => {
      const next = prev + direction;
      if (next < 0) return slides.length - 1;
      if (next >= slides.length) return 0;
      return next;
    });
  };

  const goToSlide = (index) => {
    setCurrentSlide(index);
  };

 useEffect(() => {
  async function fetchBestSellers() {
    setLoadingSellers(true);
    try {
      const res = await fetch("http://localhost:5000/api/products");
      const data = await res.json();
      
      // 👇 Add this to see all products
      console.log('All products:', data.products);
      
      const sorted = (data.products || [])
        .filter((p) => !!p.price && !!p.name && !!(p.main_image || p.image))
        .sort((a, b) => (b.reviews || 0) - (a.reviews || 0));
      
      // 👇 Add this to see what's being displayed
      console.log('Top 6 best sellers:', sorted.slice(0, 6));
      
      setBestSellers(sorted.slice(0, 6));
    } finally {
      setLoadingSellers(false);
    }
  }
  fetchBestSellers();
}, []);


  // Premium products
  useEffect(() => {
    async function fetchPremiumProducts() {
      setLoadingPremium(true);
      try {
        const res = await fetch("http://localhost:5000/api/products");
        const data = await res.json();
        const filtered = (data.products || [])
  .filter(
    (p) =>
      !!p.price &&
      !!p.name &&
      !!(p.main_image || p.image) &&
      ((p.category || "").toLowerCase().includes("decorative") ||
       (p.category || "").toLowerCase().includes("furniture") ||
       (p.category || "").toLowerCase().includes("candle") ||
       (p.category || "").toLowerCase().includes("houseware"))
  )
  .sort((a, b) => b.price - a.price); // Highest price first
setPremiumProducts(filtered.slice(0, 4));

      } finally {
        setLoadingPremium(false);
      }
    }
    fetchPremiumProducts();
  }, []);

  return (
    <div
      className="min-h-screen"
      style={{
        backgroundImage: "url('/images/home-background-img.jpg')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundAttachment: "fixed",
        backgroundRepeat: "no-repeat",
      }}
    >
      <div className="bg-transparent">
        {/* Hero Carousel */}
        <div
          className="relative w-full h-[320px] sm:h-[400px] md:h-[500px] lg:h-[600px] xl:h-[700px] overflow-hidden"
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
        >
          <div
            className="flex w-full h-full transition-transform duration-700 ease-out"
            style={{ transform: `translateX(-${currentSlide * 100}%)` }}
          >
            {slides.map((slide, index) => (
              <div key={index} className="min-w-full h-full relative">
                <img
                  src={slide.image}
                  alt={slide.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/30 to-transparent" />
                <div className="absolute inset-0 flex items-center">
                  <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-16 w-full">
                    <div className="max-w-xl sm:max-w-2xl text-white space-y-4 sm:space-y-6">
                      <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-6xl font-bold leading-tight">
                        {slide.title}
                      </h1>
                      <p className="text-sm sm:text-base md:text-xl lg:text-2xl text-gray-200">
                        {slide.subtitle}
                      </p>
                      <Link href={slide.href}>
                        <button className="mt-3 sm:mt-4 px-6 sm:px-8 py-2.5 sm:py-3 bg-amber-600 hover:bg-amber-700 text-white text-sm sm:text-base font-semibold rounded-lg shadow-lg transition-all duration-300 transform hover:scale-105">
                          {slide.cta}
                        </button>
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Nav Arrows */}
          <button
            onClick={() => changeSlide(-1)}
            className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 w-9 h-9 sm:w-10 sm:h-10 md:w-12 md:h-12 rounded-full bg-black/30 hover:bg-black/40 text-white text-xl sm:text-2xl flex items-center justify-center transition-all duration-300 z-10"
          >
            ‹
          </button>
          <button
            onClick={() => changeSlide(1)}
            className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 w-9 h-9 sm:w-10 sm:h-10 md:w-12 md:h-12 rounded-full bg-black/30 hover:bg-black/40 text-white text-xl sm:text-2xl flex items-center justify-center transition-all duration-300 z-10"
          >
            ›
          </button>

          {/* Dots */}
          <div className="absolute bottom-3 sm:bottom-5 left-1/2 -translate-x-1/2 flex gap-2 z-10">
            {slides.map((_, index) => (
              <button
                key={index}
                onClick={() => goToSlide(index)}
                className={`h-2.5 sm:h-3 rounded-full transition-all duration-300 ${
                  currentSlide === index
                    ? "bg-white w-6 sm:w-8"
                    : "bg-white/50 w-2.5 sm:w-3"
                }`}
              />
            ))}
          </div>
        </div>

        <section className="max-w-6xl xl:max-w-7xl mx-auto px-4 sm:px-6 lg:px-16 py-10 sm:py-16 relative overflow-hidden">
          {/* Premium animated background elements */}
          <div className="absolute top-0 left-0 w-96 h-96 bg-gradient-to-br from-amber-300/30 to-yellow-300/20 rounded-full blur-3xl -z-10 animate-pulse" />
          <div
            className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-gradient-to-tl from-amber-400/30 to-orange-300/20 rounded-full blur-3xl -z-10 animate-pulse"
            style={{ animationDelay: "1s" }}
          />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-radial from-amber-200/10 to-transparent rounded-full blur-2xl -z-10" />

          <div className="text-center mb-8 sm:mb-12 transition-all duration-1000 transform opacity-100 translate-y-0">
            <div className="inline-block mb-4">
              <div className="flex items-center gap-3 text-amber-600">
                <div className="h-px w-12 bg-gradient-to-r from-transparent via-amber-500 to-amber-600 animate-pulse" />
                <div className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 bg-amber-500 rounded-full animate-pulse" />
                  <span className="text-xs sm:text-sm font-semibold tracking-[0.3em] uppercase bg-gradient-to-r from-amber-700 to-amber-500 bg-clip-text text-transparent">
                    Explore Collection
                  </span>
                  <div
                    className="w-1.5 h-1.5 bg-amber-500 rounded-full animate-pulse"
                    style={{ animationDelay: "0.5s" }}
                  />
                </div>
                <div className="h-px w-12 bg-gradient-to-l from-transparent via-amber-500 to-amber-600 animate-pulse" />
              </div>
            </div>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold bg-[#562D1D] bg-clip-text text-transparent mb-2 sm:mb-3 animate-gradient drop-shadow-sm">
              Discover Our Brass Categories
            </h2>
            <p className="text-sm sm:text-base text-gray-600 max-w-2xl mx-auto font-medium">
              This Winter Season, Embrace India&apos;s Timeless Brass
              Craftsmanship
            </p>

            {/* Decorative ornament */}
            <div className="flex items-center justify-center gap-2 mt-4">
              <div className="w-2 h-2 rotate-45 bg-gradient-to-br from-amber-400 to-amber-600" />
              <div className="w-3 h-3 rotate-45 bg-gradient-to-br from-amber-500 to-amber-700" />
              <div className="w-2 h-2 rotate-45 bg-gradient-to-br from-amber-400 to-amber-600" />
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-3 gap-4 sm:gap-6">
            {[
              {
                name: "Garden Accessories",
                img: "https://i.pinimg.com/736x/65/6d/65/656d6517d262df33be725cb825cc7970.jpg",
                redirect: "/garden-accessories",
              },
              {
                name: "Candle Stands and Holders",
                img: "https://i.pinimg.com/1200x/dd/27/0e/dd270e3f80b5e7c554f04053370a41c7.jpg",
                redirect: "/candle-stands-and-holders",
              },
              {
                name: "Table Tops",
                img: "https://i.pinimg.com/736x/bf/ab/be/bfabbe07fdbbdc85b0f35ead48253c3a.jpg",
                redirect: "/table-tops",
              },
              {
                name: "Housewares",
                img: "https://i.pinimg.com/736x/29/6e/4c/296e4c17259255139fe467a05fbd7f29.jpg",
                redirect: "/housewares",
              },
              {
                name: "Furniture",
                img: "https://i.pinimg.com/736x/a0/73/34/a0733438752684e0670417b0edeaf568.jpg",
                redirect: "/furniture",
              },
              {
                name: "Decoratives",
                img: "https://i.pinimg.com/736x/6e/48/58/6e4858f9b4a3c2d351b47834fecce692.jpg ",
                redirect: "/decoratives",
              },
            ].map((cat, idx) => (
              <Link
                key={idx}
                href={cat.redirect}
                className="group cursor-pointer"
              >
                <div
                  className="transition-all duration-700 transform opacity-100 translate-y-0 animate-float"
                  style={{ animationDelay: `${idx * 0.2}s` }}
                >
                  <div className="relative overflow-hidden rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-500 group-hover:-translate-y-3 border-2 border-amber-200/40 group-hover:border-amber-400/60 bg-gradient-to-br from-white to-amber-50/30">
                    {/* Premium gradient overlay on card */}
                    <div className="absolute inset-0 bg-gradient-to-br from-amber-400/0 via-transparent to-amber-600/5 pointer-events-none z-[1]" />

                    {/* Shimmer effect */}
                    <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 bg-gradient-to-r from-transparent via-white/40 to-transparent z-10" />

                    {/* Corner accent - always visible */}
                    <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-amber-400/20 to-transparent rounded-bl-3xl" />
                    <div className="absolute bottom-0 left-0 w-16 h-16 bg-gradient-to-tr from-amber-500/15 to-transparent rounded-tr-3xl" />

                    <img
                      src={cat.img}
                      alt={cat.name}
                      className="w-full h-32 sm:h-44 md:h-56 object-cover transform group-hover:scale-110 transition-transform duration-700"
                    />

                    {/* Enhanced gradient overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent opacity-70 group-hover:opacity-85 transition-opacity duration-300" />

                    {/* Animated border on hover */}
                    <div className="absolute inset-0 border-2 border-transparent group-hover:border-amber-400/80 rounded-2xl transition-all duration-300 shadow-inner" />

                    {/* Premium shine effect */}
                    <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-white/10 to-transparent opacity-50" />
                  </div>

                  <div className="relative mt-3 sm:mt-4 overflow-hidden">
                    <p className="text-center text-sm sm:text-base font-semibold text-gray-800 group-hover:text-amber-700 transition-all duration-300 transform group-hover:scale-105 tracking-wide">
                      {cat.name}
                    </p>
                    {/* Premium underline - always visible but animates */}
                    <div
                      className="h-0.5 bg-gradient-to-r from-transparent via-[#562D1D] to-transparent transform scale-x-50 group-hover:scale-x-100 transition-transform duration-300 origin-center mt-2 mx-auto opacity-60 group-hover:opacity-100"
                      style={{ width: "70%" }}
                    />

                    {/* Decorative dots */}
                    <div className="flex items-center justify-center gap-1 mt-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <div className="w-1 h-1 bg-amber-500 rounded-full" />
                      <div className="w-1.5 h-1.5 bg-amber-600 rounded-full" />
                      <div className="w-1 h-1 bg-amber-500 rounded-full" />
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </section>

        <section className="relative py-12 sm:py-16 my-10 sm:my-16 overflow-hidden">
          {/* Animated background with premium overlay */}
          <div
            className="absolute inset-0 bg-cover bg-center transform scale-105 transition-transform duration-700 hover:scale-110"
            style={{
              backgroundImage:
                "url(https://i.pinimg.com/736x/c6/0c/2f/c60c2f8faebbb3bf9a36bd0009f1bdea.jpg)",
            }}
          />

          {/* Multiple premium gradient overlays */}
          <div className="absolute inset-0 bg-gradient-to-br from-amber-100/80 via-white/70 to-amber-50/80 backdrop-blur-sm" />
          <div className="absolute inset-0 bg-gradient-to-t from-amber-900/10 via-transparent to-amber-900/10" />
          <div
            className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-pulse"
            style={{ animationDuration: "4s" }}
          />

          {/* Premium floating particles - more visible */}
          <div
            className="absolute top-10 left-10 w-3 h-3 bg-amber-500/60 rounded-full animate-bounce shadow-lg shadow-amber-500/50"
            style={{ animationDuration: "3s" }}
          />
          <div
            className="absolute top-20 right-20 w-4 h-4 bg-yellow-500/50 rounded-full animate-bounce shadow-lg shadow-yellow-500/50"
            style={{ animationDuration: "4s", animationDelay: "0.5s" }}
          />
          <div
            className="absolute bottom-20 left-1/4 w-3 h-3 bg-amber-600/50 rounded-full animate-bounce shadow-lg shadow-amber-600/50"
            style={{ animationDuration: "3.5s", animationDelay: "1s" }}
          />
          <div
            className="absolute top-1/2 right-1/4 w-2 h-2 bg-orange-500/60 rounded-full animate-bounce shadow-lg shadow-orange-500/50"
            style={{ animationDuration: "3.2s", animationDelay: "0.8s" }}
          />

          {/* Decorative corner elements */}
          <div className="absolute top-0 left-0 w-40 h-40 bg-gradient-to-br from-amber-400/20 to-transparent rounded-br-full" />
          <div className="absolute bottom-0 right-0 w-40 h-40 bg-gradient-to-tl from-amber-400/20 to-transparent rounded-tl-full" />

          <div className="max-w-4xl mx-auto px-4 sm:px-6 relative z-10">
            <div className="text-center bg-white/95 backdrop-blur-lg rounded-3xl sm:rounded-[2rem] shadow-2xl px-5 sm:px-10 md:px-12 py-8 sm:py-10 md:py-12 border-2 border-amber-300/60 transform hover:scale-105 transition-all duration-500 hover:shadow-amber-400/40 hover:shadow-3xl relative overflow-hidden">
              {/* Premium card background patterns */}
              <div className="absolute inset-0 bg-gradient-to-br from-amber-50/50 via-transparent to-amber-100/30 pointer-events-none" />
              <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-amber-300/10 to-transparent rounded-full blur-3xl" />
              <div className="absolute bottom-0 left-0 w-64 h-64 bg-gradient-to-tr from-yellow-300/10 to-transparent rounded-full blur-3xl" />

              <div className="relative z-10">
                {/* Top decorative line - enhanced */}
                <div className="flex items-center justify-center gap-2 mb-5">
                  <div className="h-0.5 w-16 bg-gradient-to-r from-transparent via-amber-500 to-amber-600" />
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-amber-500 rounded-full animate-pulse shadow-lg shadow-amber-500/50" />
                    <div
                      className="w-1 h-1 bg-amber-600 rounded-full animate-pulse"
                      style={{ animationDelay: "0.3s" }}
                    />
                  </div>
                  <div className="h-0.5 w-16 bg-gradient-to-l from-transparent via-amber-500 to-amber-600" />
                </div>

                <p className="text-sm sm:text-base text-gray-700 mb-3 sm:mb-4 font-semibold animate-fade-in tracking-wide">
                  Let the Glow of Brass Illuminate Your Celebrations
                </p>

                <h2 className="text-2xl sm:text-3xl lg:text-5xl font-bold bg-gradient-to-r from-amber-900 via-amber-600 to-amber-900 bg-clip-text text-transparent mb-5 sm:mb-8 leading-tight animate-gradient drop-shadow-lg">
                  Sacred Brass Gifting Made
                  <br className="hidden sm:block" />
                  Meaningful, Elegant, & Timeless
                </h2>

                {/* Middle decorative element */}
                <div className="flex items-center justify-center gap-2 mb-6">
                  <div className="w-2 h-2 rotate-45 bg-gradient-to-br from-amber-400 to-amber-600" />
                  <div className="h-px w-20 bg-gradient-to-r from-transparent via-amber-400 to-amber-500" />
                  <div className="w-2.5 h-2.5 bg-amber-500 rounded-full animate-pulse shadow-lg shadow-amber-500/50" />
                  <div className="h-px w-20 bg-gradient-to-l from-transparent via-amber-400 to-amber-500" />
                  <div className="w-2 h-2 rotate-45 bg-gradient-to-br from-amber-400 to-amber-600" />
                </div>

                <Link href="/newlaunches">
                  <button className="relative px-10 sm:px-12 py-4 sm:py-5 bg-[#562D1D] hover:from-amber-800 hover:via-amber-700 hover:to-amber-800 text-white text-sm sm:text-base font-bold rounded-xl shadow-2xl shadow-amber-900/40 transition-all duration-300 transform hover:scale-110 hover:shadow-amber-900/60 overflow-hidden group border border-amber-700/50">
                    {/* Multiple shimmer layers */}
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
                    <div
                      className="absolute inset-0 bg-gradient-to-r from-transparent via-amber-400/20 to-transparent translate-x-full group-hover:-translate-x-full transition-transform duration-1000"
                      style={{ animationDelay: "0.2s" }}
                    />

                    {/* Button glow effect */}
                    <div className="absolute inset-0 bg-[#562D1D] opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                    <span className="relative z-10 flex items-center gap-3 justify-center tracking-wide">
                      Shop Now
                      <span className="transform group-hover:translate-x-2 transition-transform duration-300 text-lg">
                        →
                      </span>
                    </span>
                  </button>
                </Link>

                {/* Bottom decorative accent */}
                <div className="flex items-center justify-center gap-1.5 mt-6 opacity-60">
                  <div className="w-1 h-1 bg-amber-400 rounded-full" />
                  <div className="w-1.5 h-1.5 bg-amber-500 rounded-full" />
                  <div className="w-2 h-2 bg-amber-600 rounded-full" />
                  <div className="w-1.5 h-1.5 bg-amber-500 rounded-full" />
                  <div className="w-1 h-1 bg-amber-400 rounded-full" />
                </div>
              </div>
            </div>
          </div>
        </section>

       {/* ✅ ENHANCED Best Sellers Section - Compact & Elegant */}
<section className="max-w-6xl xl:max-w-7xl mx-auto px-4 sm:px-6 lg:px-16 py-12 sm:py-20">
  <div className="text-center mb-10 sm:mb-16 relative">
    <div className="inline-flex items-center gap-2 bg-gradient-to-r from-amber-50 to-orange-50 text-[#562D1D] px-4 sm:px-5 py-2 rounded-full text-xs sm:text-sm font-bold mb-4 sm:mb-6 shadow-sm border border-[#B8860B]/30">
      <TrendingUp className="w-4 h-4" />
      <span>Trending Now</span>
    </div>
    <h2 className="text-2xl sm:text-3xl lg:text-5xl font-bold text-[#562D1D] mb-3 sm:mb-4 tracking-tight">
      Best Sellers
    </h2>
    <p className="text-sm sm:text-base lg:text-lg text-gray-600 max-w-2xl mx-auto">
      Our most loved brass creations, handpicked by thousands of satisfied customers!
    </p>
  </div>

  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
    {loadingSellers ? (
      <div className="col-span-full text-center py-12 sm:py-20">
        <div className="inline-block w-12 h-12 sm:w-16 sm:h-16 border-4 border-amber-200 border-t-[#562D1D] rounded-full animate-spin mb-3 sm:mb-4" />
        <p className="text-base sm:text-lg text-[#B8860B] font-medium">
          Loading best sellers...
        </p>
      </div>
    ) : bestSellers.length === 0 ? (
      <div className="col-span-full text-center py-12 sm:py-20">
        <div className="text-4xl sm:text-6xl mb-3 sm:mb-4">📦</div>
        <p className="text-base sm:text-lg text-gray-400">
          No best sellers found.
        </p>
      </div>
    ) : (
      bestSellers.map((product, idx) => (
        <div
          key={product.id || idx}
          className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-500 overflow-hidden group cursor-pointer transform hover:-translate-y-1 border border-gray-100 hover:border-[#B8860B]/30"
          onClick={() => router.push(`/product/${product.id}`)}
        >
          {/* ✅ Compact Image Section */}
          <div className="relative overflow-hidden aspect-[5/4]">
            <img
              src={product.main_image || product.image}
              alt={product.name}
              className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700"
              onError={(e) => {
                e.target.src = "https://via.placeholder.com/800x600?text=No+Image";
              }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#562D1D]/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

            {/* ✅ Compact Bestseller Badge */}
            <div className="absolute top-2.5 left-2.5 bg-gradient-to-br from-[#B8860B] to-[#562D1D] text-white px-2.5 py-1 rounded-lg text-[10px] sm:text-xs font-bold shadow-md flex items-center gap-1">
              <Star className="w-3 h-3 fill-white" />
              <span>Bestseller</span>
            </div>

            {/* ✅ Compact Sales Badge */}
            <div className="absolute top-2.5 right-2.5 bg-white/95 backdrop-blur-sm text-[#562D1D] px-2.5 py-1 rounded-lg text-[10px] sm:text-xs font-bold shadow-md">
              <span>{product.sales || "1000"}+ sold</span>
            </div>
          </div>

          {/* ✅ Compact Content Section */}
          <div className="p-3 sm:p-3.5">
            <h3 className="text-sm sm:text-base font-bold text-gray-800 mb-1.5 h-9 sm:h-10 line-clamp-2 leading-tight group-hover:text-[#B8860B] transition-colors duration-300">
              {product.name}
            </h3>

            {/* ✅ Compact Pricing */}
            <div className="flex items-baseline gap-1.5 sm:gap-2 mb-2">
              <span className="text-xl sm:text-2xl font-bold text-[#562D1D]">
                ₹{product.price?.toLocaleString()}
              </span>
              {(product.originalPrice || product.discounted_price) && (
                <>
                  <span className="text-xs sm:text-sm text-gray-400 line-through">
                    ₹{(product.originalPrice || product.discounted_price)?.toLocaleString()}
                  </span>
                  <span className="text-[10px] sm:text-xs font-bold text-green-600 bg-green-50 px-1.5 py-0.5 rounded">
                    {Math.round(
                      100 * (1 - product.price / (product.originalPrice || product.discounted_price || product.price || 1))
                    )}% OFF
                  </span>
                </>
              )}
            </div>

            {/* ✅ Compact View Details Link */}
            <div className="pt-2 border-t border-gray-100">
              <p className="text-xs sm:text-sm text-[#562D1D] group-hover:text-[#B8860B] transition-colors duration-300 font-semibold flex items-center gap-1.5">
                <span>View Details</span>
                <svg
                  className="w-3.5 h-3.5 sm:w-4 sm:h-4 transform group-hover:translate-x-1 transition-transform duration-300"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </p>
            </div>
          </div>
        </div>
      ))
    )}
  </div>

  {/* ✅ Enhanced Compact Button */}
  {bestSellers.length > 0 && (
    <div className="text-center mt-10 sm:mt-12">
      <Link href="/newlaunches">
        <button className="inline-flex items-center gap-2 px-6 sm:px-8 py-2.5 sm:py-3 bg-gradient-to-r from-[#562D1D] to-[#B8860B] hover:from-[#B8860B] hover:to-[#562D1D] text-white text-sm sm:text-base font-bold rounded-full shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 cursor-pointer border border-[#B8860B]/30">
          <span>View All Best Sellers</span>
          <svg
            className="w-4 h-4 sm:w-5 sm:h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2.5}
              d="M17 8l4 4m0 0-4 4m4-4H3"
            />
          </svg>
        </button>
      </Link>
    </div>
  )}
</section>

        {/* Premium Collection */}
        <section
          className="py-12 sm:py-16 relative"
          style={{
            backgroundImage: "url('/images/home-background-img.jpg')",
            backgroundSize: "cover",
            backgroundPosition: "center",
            backgroundAttachment: "fixed",
            backgroundRepeat: "no-repeat",
          }}
        >
          <div className="absolute inset-0 bg-amber-50/80 -z-10"></div>

          <div className="max-w-6xl xl:max-w-7xl mx-auto px-4 sm:px-6 lg:px-16 relative z-10">
            <div className="text-center mb-8 sm:mb-12">
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-800 mb-2 sm:mb-3">
                Premium Brass Essentials
              </h2>
              <p className="text-sm sm:text-base text-gray-600">
                Illuminate your home with beautifully crafted brass pieces
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 sm:gap-6">
              {loadingPremium ? (
                <div className="col-span-full text-center text-base sm:text-lg py-10 sm:py-16 text-amber-600">
                  Loading premium products...
                </div>
              ) : premiumProducts.length === 0 ? (
                <div className="col-span-full text-center text-base sm:text-lg py-10 sm:py-16 text-gray-400">
                  No premium brass products found.
                </div>
              ) : (
                premiumProducts.map((product, idx) => (
                  <div
                    key={product.id || idx}
                    className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden group cursor-pointer"
                    onClick={() => router.push(`/product/${product.id}`)}
                  >
                    <div className="relative overflow-hidden">
                      <img
                        src={product.main_image || product.image}
                        alt={product.name}
                        className="w-full h-44 sm:h-52 md:h-56 object-cover transform group-hover:scale-110 transition-transform duration-500"
                      />
                    </div>
                    <div className="p-4 sm:p-5">
                      <h3 className="text-sm sm:text-base text-gray-700 mb-2 sm:mb-3 h-10 line-clamp-2">
                        {product.name}
                      </h3>
                      <div className="flex items-center gap-1.5 sm:gap-2">
                        <span className="text-lg sm:text-xl font-bold text-gray-900">
                          ₹{product.price?.toLocaleString()}
                        </span>
                        {product.originalPrice || product.discounted_price ? (
                          <span className="text-xs sm:text-sm text-gray-400 line-through">
                            ₹
                            {(
                              product.originalPrice || product.discounted_price
                            )?.toLocaleString()}
                          </span>
                        ) : null}
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </section>

        {/* Wedding Collection */}
        <section className="max-w-6xl xl:max-w-7xl mx-auto px-4 sm:px-6 lg:px-16 py-12 sm:py-16">
          <div className="text-center mb-8 sm:mb-12">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-800 mb-2 sm:mb-3">
              Sacred Brass Wedding Collection
            </h2>
            <p className="text-sm sm:text-base text-gray-600">
              Handcrafted Brass Decor &amp; Furnishing for Every Sacred
              Celebration
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
            {[
              {
  title: "Brass Candle Stands & Holders",
  desc: "Illuminate your space with elegant handcrafted brass candle stands and holders from Moradabad artisans.",
  img: "https://i.pinimg.com/1200x/08/bf/cf/08bfcf67ca34829e6339883b807c8be6.jpg",
  redirect: "/candle-stands-and-holders",
},
{
  title: "Brass Garden Accessories",
  desc: "Enhance your garden with artistic brass planters, lamps, and decorative outdoor accessories.",
  img: "https://i.pinimg.com/1200x/eb/e1/e8/ebe1e8ef174dd8e9d6fba5f3f3516d68.jpg",
  redirect: "/garden-accessories",
},
{
  title: "Furniture Collection",
  desc: "Discover premium brass furniture pieces that blend antique charm with functional elegance.",
  img: "https://i.pinimg.com/736x/b8/62/88/b86288a9f0780a32a054fddfe8c9a98f.jpg",
  redirect: "/furniture",
},
{
  title: "Brass Decorative Collection",
  desc: "Adorn your interiors with handcrafted brass decor pieces that reflect timeless Indian artistry.",
  img: "https://i.pinimg.com/736x/19/83/b9/1983b9179536db5cf4993cdd54ccb5a8.jpg",
  redirect: "/decoratives",
},

            ].map((craft, idx) => (
              <div
                key={idx}
                className="relative rounded-2xl overflow-hidden h-80 sm:h-96 group shadow-lg hover:shadow-2xl transition-all duration-300"
              >
                <img
                  src={craft.img}
                  alt={craft.title}
                  className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />
                <div className="absolute inset-0 flex flex-col items-center justify-center text-center text-white px-4 sm:px-8">
                  <h3 className="text-2xl sm:text-3xl font-bold mb-2 sm:mb-3">
                    {craft.title}
                  </h3>
                  <p className="text-sm sm:text-lg mb-4 sm:mb-6 text-gray-200">
                    {craft.desc}
                  </p>
                  <Link href={craft.redirect}>
                    <button className="px-6 sm:px-8 py-2.5 sm:py-3 bg-white text-gray-900 text-sm sm:text-base font-semibold rounded-lg hover:bg-gray-100 transition-all duration-300 transform group-hover:scale-105 cursor-pointer">
                      View All
                    </button>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
};

export default HomePage;
