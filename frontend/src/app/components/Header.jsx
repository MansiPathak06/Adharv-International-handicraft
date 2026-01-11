'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  Search,
  User,
  ShoppingCart,
  Sparkles,
  Gift,
  Home as HomeIcon,
  ShoppingBag,
  Palette,
  Flower,
  Leaf,
  Menu,
  X
} from 'lucide-react';
import Image from 'next/image';

const Header = () => {
  const pathname = usePathname();
  const router = useRouter();
  const [cartCount, setCartCount] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const isActive = (path) => pathname === path;

  const computeCartCount = () => {
    const userEmail = localStorage.getItem('userEmail');
    if (!userEmail) {
      setCartCount(0);
      return;
    }
    const cartKey = `cartItems:${userEmail.toLowerCase()}`;
    const items = JSON.parse(localStorage.getItem(cartKey) || '[]');
    const count = items.reduce((sum, i) => sum + (i.qty || 0), 0);
    setCartCount(count);
  };

  useEffect(() => {
    computeCartCount();
    const handler = () => computeCartCount();
    window.addEventListener('cart-updated', handler);
    window.addEventListener('storage', handler);
    return () => {
      window.removeEventListener('cart-updated', handler);
      window.removeEventListener('storage', handler);
    };
  }, []);

  const handleSearch = () => {
    const q = searchTerm.trim();
    if (!q) return;
    router.push(`/search?query=${encodeURIComponent(q)}`);
  };

  const handleNavClick = () => {
    setMobileMenuOpen(false);
  };

  return (
    <header 
      className="shadow-lg sticky top-0 z-[1000]"
      style={{
        backgroundImage: "url('/images/home-background-img.jpg')",
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat'
      }}
    >
      {/* Header Top */}
      <div className="flex items-center px-4 py-2 max-w-[1400px] mx-auto justify-between gap-4 sm:px-6 md:px-8 md:gap-6 lg:px-12 lg:gap-8 flex-wrap">
        {/* Logo */}
        <Link href="/">
          <div className="flex flex-col cursor-pointer transition-transform duration-300 hover:-translate-y-0.5">
            <Image
              src="/images/logo.jpg"
              alt="Adhharv International"
              width={70}
              height={70}
              className="object-contain rounded-xl"
              priority
            />
          </div>
        </Link>

        {/* Search Bar */}
        <div
          className="order-3 w-full mt-2 sm:order-0 sm:mt-0 sm:w-auto sm:flex-1 md:max-w-[500px] lg:max-w-[600px] relative"
        >
          <input
            type="text"
            placeholder="Search for products..."
            aria-label="Search products"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') handleSearch();
            }}
            className="w-full py-2.5 md:py-3 px-4 md:px-5 pr-[50px] border-2 placeholder-gray-600 text-gray-600 border-gray-300 rounded-full text-xs md:text-sm transition-all duration-300 bg-white focus:outline-none focus:border-[#562D1D] focus:shadow-[0_0_0_3px_rgba(205,155,77,0.1)]"
          />
          <button
            aria-label="Search"
            onClick={handleSearch}
            className="absolute right-[5px] top-1/2 -translate-y-1/2 bg-[#562D1D] border-none w-[34px] h-[34px] md:w-[38px] md:h-[38px] rounded-full cursor-pointer transition-all duration-300 flex items-center justify-center hover:scale-110 hover:shadow-[0_5px_15px_rgba(205,155,77,0.3)]"
          >
            <Search size={16} className="text-white md:size-[18px]" />
          </button>
        </div>

        {/* Header Icons */}
        <div className="flex gap-2 items-center shrink-0">
          <button
            className="bg-white border-2 border-gray-300 w-9 h-9 md:w-[42px] md:h-[42px] rounded-full cursor-pointer transition-all duration-300 flex items-center justify-center relative hover:border-[#562D1D] hover:-translate-y-0.5 hover:shadow-lg active:translate-y-0"
            title="Account"
            aria-label="User account"
            onClick={() => router.push('/auth')}
          >
            <User size={18} className="text-gray-700 md:size-[20px]" />
          </button>
          <button
            className="bg-white border-2 border-gray-300 w-9 h-9 md:w-[42px] md:h-[42px] rounded-full cursor-pointer transition-all duration-300 flex items-center justify-center relative hover:border-[#562D1D] hover:-translate-y-0.5 hover:shadow-lg active:translate-y-0"
            title="Cart"
            aria-label="Shopping cart"
            onClick={() => router.push('/cart')}
          >
            <ShoppingCart size={18} className="text-gray-700 md:size-[20px]" />
            {cartCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] font-bold rounded-full px-1.5 py-0.5">
                {cartCount}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* Navigation Bar */}
      <nav className="bg-[#562D1D] flex justify-center items-center p-0 shadow-[0_4px_10px_rgba(0,0,0,0.1)] relative">
        {/* Mobile Navigation Bar - Increased Height */}
        <div className="md:hidden w-full py-4 flex items-center justify-center bg-[#562D1D]">
          <button
            className="absolute left-4 text-white p-2"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Desktop Navigation */}
        <div className="hidden md:flex w-full max-w-[1400px] overflow-x-auto no-scrollbar">
          <div className="flex mx-auto">
            <Link
              href="/"
              className={`text-white no-underline px-4 md:px-7 py-3 md:py-4 text-xs md:text-sm font-medium transition-all duration-300 relative flex items-center gap-1.5 whitespace-nowrap hover:bg-white/15 ${
                isActive('/home')
                  ? 'after:content-[""] after:absolute after:bottom-0 after:left-1/2 after:-translate-x-1/2 after:w-[60%] after:h-[3px] after:bg-white'
                  : 'after:content-[""] after:absolute after:bottom-0 after:left-1/2 after:-translate-x-1/2 after:w-0 after:h-[3px] after:bg-white after:transition-all after:duration-300 hover:after:w-[60%]'
              }`}
            >
              <HomeIcon size={14} className="md:size-[16px]" />
              Home
            </Link>
            <Link
              href="/newlaunches"
              className={`text-white no-underline px-4 md:px-7 py-3 md:py-4 text-xs md:text-sm font-medium transition-all duration-300 relative flex items-center gap-1.5 whitespace-nowrap hover:bg-white/15 ${
                isActive('/newlaunches')
                  ? 'after:content-[""] after:absolute after:bottom-0 after:left-1/2 after:-translate-x-1/2 after:w-[60%] after:h-[3px] after:bg-white'
                  : 'after:content-[""] after:absolute after:bottom-0 after:left-1/2 after:-translate-x-1/2 after:w-0 after:h-[3px] after:bg-white after:transition-all after:duration-300 hover:after:w-[60%]'
              }`}
            >
              <Sparkles size={14} className="md:size-[16px]" />
              New Launches
            </Link>
            <Link
              href="/decoratives"
              className={`text-white no-underline px-4 md:px-7 py-3 md:py-4 text-xs md:text-sm font-medium transition-all duration-300 relative flex items-center gap-1.5 whitespace-nowrap hover:bg-white/15 ${
                isActive('/gift')
                  ? 'after:content-[""] after:absolute after:bottom-0 after:left-1/2 after:-translate-x-1/2 after:w-[60%] after:h-[3px] after:bg-white'
                  : 'after:content-[""] after:absolute after:bottom-0 after:left-1/2 after:-translate-x-1/2 after:w-0 after:h-[3px] after:bg-white after:transition-all after:duration-300 hover:after:w-[60%]'
              }`}
            >
              <Flower size={14} className="md:size-[16px]" />
              All Decoratives
            </Link>
            <Link
              href="/garden-decoratives"
              className={`text-white no-underline px-4 md:px-7 py-3 md:py-4 text-xs md:text-sm font-medium transition-all duration-300 relative flex items-center gap-1.5 whitespace-nowrap hover:bg-white/15 ${
                isActive('/garden-decoratives')
                  ? 'after:content-[""] after:absolute after:bottom-0 after:left-1/2 after:-translate-x-1/2 after:w-[60%] after:h-[3px] after:bg-white'
                  : 'after:content-[""] after:absolute after:bottom-0 after:left-1/2 after:-translate-x-1/2 after:w-0 after:h-[3px] after:bg-white after:transition-all after:duration-300 hover:after:w-[60%]'
              }`}
            >
              <Leaf size={14} className="md:size-[16px]" />
              Garden Decoratives
            </Link>
            <Link
              href="/shopsbycollection"
              className={`text-white no-underline px-4 md:px-7 py-3 md:py-4 text-xs md:text-sm font-medium transition-all duration-300 relative flex items-center gap-1.5 whitespace-nowrap hover:bg-white/15 ${
                isActive('/shopsbycollection')
                  ? 'after:content-[""] after:absolute after:bottom-0 after:left-1/2 after:-translate-x-1/2 after:w-[60%] after:h-[3px] after:bg-white'
                  : 'after:content-[""] after:absolute after:bottom-0 after:left-1/2 after:-translate-x-1/2 after:w-0 after:h-[3px] after:bg-white after:transition-all after:duration-300 hover:after:w-[60%]'
              }`}
            >
              <ShoppingBag size={14} className="md:size-[16px]" />
              Shop By Collection
            </Link>
            <Link
              href="/lightning"
              className={`text-white no-underline px-4 md:px-7 py-3 md:py-4 text-xs md:text-sm font-medium transition-all duration-300 relative flex items-center gap-1.5 whitespace-nowrap hover:bg-white/15 ${
                isActive('/craft')
                  ? 'after:content-[""] after:absolute after:bottom-0 after:left-1/2 after:-translate-x-1/2 after:w-[60%] after:h-[3px] after:bg-white'
                  : 'after:content-[""] after:absolute after:bottom-0 after:left-1/2 after:-translate-x-1/2 after:w-0 after:h-[3px] after:bg-white after:transition-all after:duration-300 hover:after:w-[60%]'
              }`}
            >
              <Sparkles size={14} className="md:size-[16px]" />
              Lightning
            </Link>
          </div>
        </div>

        {/* Mobile Navigation Dropdown */}
        {mobileMenuOpen && (
          <div className="md:hidden absolute top-full left-0 w-full bg-[#562D1D] shadow-lg z-50">
            <Link
              href="/"
              onClick={handleNavClick}
              className={`text-white no-underline px-6 py-3 text-sm font-medium transition-all duration-300 flex items-center gap-2 border-b border-white/10 hover:bg-white/15 ${
                isActive('/home') ? 'bg-white/20' : ''
              }`}
            >
              <HomeIcon size={16} />
              Home
            </Link>
            <Link
              href="/newlaunches"
              onClick={handleNavClick}
              className={`text-white no-underline px-6 py-3 text-sm font-medium transition-all duration-300 flex items-center gap-2 border-b border-white/10 hover:bg-white/15 ${
                isActive('/newlaunches') ? 'bg-white/20' : ''
              }`}
            >
              <Sparkles size={16} />
              New Launches
            </Link>
            <Link
              href="/decoratives"
              onClick={handleNavClick}
              className={`text-white no-underline px-6 py-3 text-sm font-medium transition-all duration-300 flex items-center gap-2 border-b border-white/10 hover:bg-white/15 ${
                isActive('/gift') ? 'bg-white/20' : ''
              }`}
            >
              <Flower size={16} />
              All Decoratives
            </Link>
            <Link
              href="/garden-decoratives"
              onClick={handleNavClick}
              className={`text-white no-underline px-6 py-3 text-sm font-medium transition-all duration-300 flex items-center gap-2 border-b border-white/10 hover:bg-white/15 ${
                isActive('/garden-decoratives') ? 'bg-white/20' : ''
              }`}
            >
              <Leaf size={16} />
              Garden Decoratives
            </Link>
            <Link
              href="/shopsbycollection"
              onClick={handleNavClick}
              className={`text-white no-underline px-6 py-3 text-sm font-medium transition-all duration-300 flex items-center gap-2 border-b border-white/10 hover:bg-white/15 ${
                isActive('/shopsbycollection') ? 'bg-white/20' : ''
              }`}
            >
              <ShoppingBag size={16} />
              Shop By Collection
            </Link>
            <Link
              href="/lightning"
              onClick={handleNavClick}
              className={`text-white no-underline px-6 py-3 text-sm font-medium transition-all duration-300 flex items-center gap-2 hover:bg-white/15 ${
                isActive('/craft') ? 'bg-white/20' : ''
              }`}
            >
              <Sparkles size={16} />
              Lightning
            </Link>
          </div>
        )}
      </nav>
    </header>
  );
};

export default Header;