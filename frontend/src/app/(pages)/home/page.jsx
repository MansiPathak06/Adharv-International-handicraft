'use client';

import Link from 'next/link';
import React, { useState, useEffect } from 'react';

import { useRouter } from 'next/navigation';

const HomePage = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  const slides = [
    {
      image: 'https://i.pinimg.com/1200x/a0/f7/c7/a0f7c741772f42beb1b81bbb2c7d4072.jpg',
      title: 'Elegant Brass Creations',
      subtitle: 'Traditional Craftsmanship, Modern Elegance',
      cta: 'Explore Collection'
    },
    {
      image: 'https://i.pinimg.com/1200x/a3/67/5f/a3675f67a9e90886a155d0cef99359f9.jpg',
      title: 'Divine Brass Diyas & Lamps',
      subtitle: 'Illuminate Your Home with Warmth',
      cta: 'Shop Now'
    },
    {
      image: 'https://i.pinimg.com/1200x/1a/1b/86/1a1b86a0087bed6f0cba5d649ce50997.jpg',
      title: 'Brass Idols & Sculptures',
      subtitle: 'Bring Home Spiritual Serenity',
      cta: 'Discover More'
    },
    {
      image: 'https://i.pinimg.com/1200x/ef/40/2e/ef402effd46c4249a4eb1763ed127eb6.jpg',
      title: 'Premium Brass Utensils',
      subtitle: 'For a Healthier, Royal Lifestyle',
      cta: 'View Products'
    },
    {
      image: 'https://i.pinimg.com/1200x/05/1d/7e/051d7e86270e2fa2c373b47b21195caf.jpg',
      title: 'Decor that Shines',
      subtitle: 'Handcrafted Brass Art Pieces',
      cta: 'Shop Decor'
    }
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

  const router = useRouter();
  const handleNavigate = () => {
    router.push('/')
  }

  return (
    <div className="bg-gray-50">
      {/* Hero Carousel */}
      <div
        className="relative w-full h-[600px] lg:h-[700px] overflow-hidden"
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
                <div className="container mx-auto px-6 lg:px-16">
                  <div className="max-w-2xl text-white space-y-6">
                    <h1 className="text-4xl lg:text-6xl font-bold leading-tight">
                      {slide.title}
                    </h1>
                    <p className="text-xl lg:text-2xl text-gray-200">
                      {slide.subtitle}
                    </p>
                    <button className="mt-4 px-8 py-3 bg-amber-600 hover:bg-amber-700 text-white font-semibold rounded-lg shadow-lg transition-all duration-300 transform hover:scale-105">
                      {slide.cta}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Navigation Arrows */}
        <button
          onClick={() => changeSlide(-1)}
          className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/20 hover:bg-white/30 backdrop-blur-sm text-white text-2xl flex items-center justify-center transition-all duration-300 z-10"
        >
          ‹
        </button>
        <button
          onClick={() => changeSlide(1)}
          className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/20 hover:bg-white/30 backdrop-blur-sm text-white text-2xl flex items-center justify-center transition-all duration-300 z-10"
        >
          ›
        </button>

        {/* Dot Indicators */}
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2 z-10">
          {slides.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`w-3 h-3 rounded-full transition-all duration-300 ${currentSlide === index ? 'bg-white w-8' : 'bg-white/50'
                }`}
            />
          ))}
        </div>
      </div>

      {/* Categories Section */}
      <section className="container mx-auto px-6 lg:px-16 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl lg:text-4xl font-bold text-gray-800 mb-3">
            Discover Our Brass Categories
          </h2>
          <p className="text-gray-600">
            This Winter Season, Embrace India's Timeless Brass Craftsmanship
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
          {[
            {
              name: 'Brass Pooja Items',
              img: 'https://i.pinimg.com/736x/79/0a/bd/790abd79e930470f293f1c66f2d693b5.jpg',
              redirect: "/pooja_items"
            },
            {
              name: 'Brass Utensils',
              img: 'https://i.pinimg.com/736x/3b/52/22/3b52221c6499eea61ea5115674c79f55.jpg',
              redirect: "/utensils"
            },
            { name: 'Brass Diyas & Lamps', img: 'https://i.pinimg.com/1200x/15/dd/0a/15dd0af7411ca49ba27caee6f0f49fe4.jpg', redirect: "/diyas_lamps" },
            { name: 'Brass Serveware', img: 'https://i.pinimg.com/736x/40/ad/04/40ad0432c9441d2bbf6ac0107c7b85d3.jpg', redirect: "/serveware" },
            { name: 'Brass Home Decor', img: 'https://i.pinimg.com/736x/f9/9c/80/f99c80f30d0677757127f1967cb0df26.jpg', redirect: "/brass_home_decor" }
          ].map((cat, idx) => (
            <Link key={idx} href={cat.redirect} className="group cursor-pointer">
              <div className="relative overflow-hidden rounded-2xl shadow-md hover:shadow-xl transition-all duration-300">
                <img
                  src={cat.img}
                  alt={cat.name}
                  className="w-full h-64 object-cover transform group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </div>
              <p className="text-center mt-4 font-medium text-gray-700 group-hover:text-amber-700 transition-colors">
                {cat.name}
              </p>
            </Link>
          ))}
        </div>
      </section>

      {/* Featured Banner */}
      <section className="relative py-20 my-16 overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: 'url(https://i.pinimg.com/736x/c6/0c/2f/c60c2f8faebbb3bf9a36bd0009f1bdea.jpg)',
            redirect:'/Gift'
           }}
        />
        <div className="absolute inset-0 bg-white/60 backdrop-blur-sm" />

        <div className="container mx-auto px-6 relative z-10">
          <div className="max-w-3xl mx-auto text-center bg-white/80 backdrop-blur-md rounded-3xl shadow-2xl p-12">
            <p className="text-gray-700 text-lg mb-3">
              Let the Glow of Brass Illuminate Your Celebrations
            </p>
            <h2 className="text-4xl lg:text-5xl font-bold text-amber-900 mb-8 leading-tight">
              Sacred Brass Gifting Made<br />Meaningful, Elegant, & Timeless
            </h2>
            <Link href="/gift">

            <button className="px-10 py-4 bg-amber-900 hover:bg-amber-800 text-white font-semibold rounded-lg shadow-lg transition-all duration-300 transform hover:scale-105">
              Shop Now
            </button>
            </Link>

          </div>
        </div>
      </section>

      {/* Best Sellers */}
      <section className="container mx-auto px-6 lg:px-16 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl lg:text-4xl font-bold text-gray-800 mb-3">
            Best Sellers
          </h2>
          <p className="text-gray-600">
            Our most loved brass creations
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
          {[
            { name: 'Handcrafted Brass Coffee Dabara Set', price: 699, original: 1398, discount: 50, img: 'https://i.pinimg.com/1200x/c5/7d/c0/c57dc0351b92117bb8cac3798dec641f.jpg' },
            { name: 'Elegant Brass Serving Bowl With Handles', price: 499, original: 999, discount: 50, img: 'https://i.pinimg.com/1200x/e4/42/64/e442645d5e229d3baac0e618709fe896.jpg' },
            { name: 'Traditional Brass Diya Set of 5 Pieces', price: 499, original: 999, discount: 50, img: 'https://i.pinimg.com/1200x/ea/f7/73/eaf7730cf6c79e2b99180475d86eee19.jpg' },
            { name: 'Antique Brass Masala Box With 7 Containers', price: 1829, original: 2999, discount: 39, img: 'https://i.pinimg.com/1200x/e1/b5/a1/e1b5a14306a6d3288e1c1bc31244009a.jpg' },
            { name: 'Handmade Brass Urli Bowl Large Size', price: 1574, original: 3499, discount: 55, img: 'https://i.pinimg.com/1200x/71/d8/90/71d8902a30a95ba44960dd9c45c438f0.jpg' }
          ].map((product, idx) => (
            <div key={idx} className="bg-white rounded-xl shadow-md hover:shadow-2xl transition-all duration-300 overflow-hidden group">
              <div className="relative overflow-hidden">
                <img
                  src={product.img}
                  alt={product.name}
                  className="w-full h-64 object-cover transform group-hover:scale-110 transition-transform duration-500"
                />
                <span className="absolute top-3 right-3 bg-red-500 text-white px-3 py-1 rounded-full text-sm font-bold shadow-lg">
                  -{product.discount}%
                </span>
              </div>
              <div className="p-5">
                <h3 className="text-sm text-gray-700 mb-3 h-10 line-clamp-2">
                  {product.name}
                </h3>
                <div className="flex items-center gap-2 mb-4">
                  <span className="text-2xl font-bold text-gray-900">
                    ₹{product.price}
                  </span>
                  <span className="text-sm text-gray-400 line-through">
                    ₹{product.original}
                  </span>
                </div>
                <button className="w-full py-3 bg-amber-500 hover:bg-amber-600 text-white font-semibold rounded-lg transition-colors duration-300">
                  Add to Cart
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Premium Collection */}
      <section className="bg-amber-50 py-16">
        <div className="container mx-auto px-6 lg:px-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-800 mb-3">
              Premium Brass Essentials
            </h2>
            <p className="text-gray-600">
              Illuminate your home with beautifully crafted brass pieces
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { name: 'Handcrafted Brass Pooja Thali Set', price: 3309, original: 5949, img: 'https://i.pinimg.com/1200x/cc/66/2e/cc662ec69518fd54fc4ed0b7d9bebfcc.jpg' },
              { name: 'Traditional Brass Water Pitcher', price: 1291, original: 3691, img: 'https://i.pinimg.com/1200x/6a/da/77/6ada77b08e90ec575542f5e734297d97.jpg' },
              { name: 'Antique Brass Temple Bell With Chain', price: 809, original: 1619, img: 'https://i.pinimg.com/1200x/e2/89/a5/e289a576225997033df0dfbf1a8d5e84.jpg' },
              { name: 'Pure Brass Panchpatra With Spoon', price: 1574, original: 3949, img: 'https://i.pinimg.com/1200x/a8/d0/b5/a8d0b5e7b53487ab749bb513e0bf61ae.jpg' }
            ].map((item, idx) => (
              <div key={idx} className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden group">
                <div className="relative overflow-hidden">
                  <img
                    src={item.img}
                    alt={item.name}
                    className="w-full h-56 object-cover transform group-hover:scale-110 transition-transform duration-500"
                  />
                </div>
                <div className="p-5">
                  <h3 className="text-sm text-gray-700 mb-3 h-10">
                    {item.name}
                  </h3>
                  <div className="flex items-center gap-2">
                    <span className="text-xl font-bold text-gray-900">
                      ₹{item.price}
                    </span>
                    <span className="text-sm text-gray-400 line-through">
                      ₹{item.original}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      

      {/* Collections Grid */}
      <section className="container mx-auto px-6 lg:px-16 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl lg:text-4xl font-bold text-gray-800 mb-3">
            Sacred Brass Wedding Collection
          </h2>
          <p className="text-gray-600">
            Handcrafted Brass Decor & Furnishing for Every Sacred Celebration
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {[
            {
              title: 'Moradabad Brass',
              desc: 'Handcrafted by Master Artisans from the Brass City of India',
              img: 'https://i.pinimg.com/736x/98/91/4d/98914d809d66427e2a4adff8e70e25af.jpg',
              redirect: "/utensils"
            },
            {
              title: 'Temple Brass Collection',
              desc: 'Bring Home the Divine Energy of Sacred Brass',
              img: 'https://i.pinimg.com/736x/79/0a/bd/790abd79e930470f293f1c66f2d693b5.jpg',
              redirect: "/pooja_items"
            },

            {
              title: 'Antique Brass Collection',
              desc: 'Timeless Elegance For Your Home With Vintage Brass Artifacts',
              img: 'https://i.pinimg.com/736x/cd/38/d9/cd38d9ccc6fc96b83933a49c30310d13.jpg',
              redirect: "/brass_home_decor"
            },

            {
              title: 'The Brass Kitchen Collection',
              desc: 'Traditional Brass Utensils Crafted by Artisans in Moradabad and Jaipur, India',
              img: 'https://i.pinimg.com/736x/19/83/b9/1983b9179536db5cf4993cdd54ccb5a8.jpg',
              redirect: "/utensils"
            }
          ].map((craft, idx) => (
            <div key={idx} className="relative rounded-2xl overflow-hidden h-96 group  shadow-lg hover:shadow-2xl transition-all duration-300">
              <img
                src={craft.img}
                alt={craft.title}
                className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />

              <div className="absolute inset-0 flex flex-col items-center justify-center text-center text-white p-8">
                <h3 className="text-3xl font-bold mb-3">
                  {craft.title}
                </h3>
                <p className="text-lg mb-6 text-gray-200">
                  {craft.desc}
                </p>
                <Link href={craft.redirect}>
                <button className="px-8 py-3 bg-white text-gray-900 font-semibold rounded-lg hover:bg-gray-100 transition-all duration-300 transform group-hover:scale-105 cursor-pointer" >
                  View All
                </button>
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default HomePage;