"use client";

export default function Footer() {
  return (
    <footer className="bg-black text-white px-8 py-20">
      {/* TOP SECTION */}
      <div className="flex flex-col items-center gap-6 mb-16 text-center">
        <h1 className="text-3xl font-semibold max-w-3xl leading-snug">
          Our responsibility is to leave our cities and regions in a better
          condition than we found them.
        </h1>

        <p className="text-gray-400 max-w-2xl">
          Welcome to Adharv International. If you would like more information on
          how we are helping to have a pronounced impact on the communities we
          serve, please subscribe.
        </p>

        <a
          href="#"
          className="mt-4 text-white border-b border-white pb-1 hover:text-[#562D1D] hover:border-[#562D1D] transition"
        >
          Subscribe for News →
        </a>
      </div>

      {/* LINKS SECTION */}
      <div className="flex flex-wrap justify-center gap-16 mt-12">
        
        <div>
          <h3 className="font-semibold mb-2 after:content-['→'] after:ml-1 after:text-[#562D1D]">
            Contact
          </h3>
          <p className="text-gray-400 text-sm">Moradabad, Uttar Pradesh</p>
          <p className="text-gray-400 text-sm">Tel: (+91) 000000000</p>
          <a
            href="mailto:info@anushkahandicraft.com"
            className="block text-gray-400 text-sm hover:text-white transition"
          >
            info@anushkahandicraft.com
          </a>
        </div>

        <div>
          <h3 className="font-semibold mb-2 after:content-['→'] after:ml-1 after:text-[#562D1D]">
            Links
          </h3>
          <a className="block text-gray-400 text-sm hover:text-white transition" href="/newlaunches">New Launches</a>
          <a className="block text-gray-400 text-sm hover:text-white transition" href="#gifting">Gifting</a>
          <a className="block text-gray-400 text-sm hover:text-white transition" href="#home-and-living">Home and Living</a>
          <a className="block text-gray-400 text-sm hover:text-white transition" href="#shop-collection">Shop by Collection</a>
          <a className="block text-gray-400 text-sm hover:text-white transition" href="#craft">Craft</a>
          <a className="block text-gray-400 text-sm hover:text-white transition" href="#stories">Stories</a>
        </div>

        <div>
          <h3 className="font-semibold mb-2 after:content-['→'] after:ml-1 after:text-[#562D1D]">
            Business
          </h3>
        </div>
      </div>

      {/* BOTTOM SECTION */}
      <div className="text-center border-t border-gray-800 mt-16 pt-6 text-gray-500 text-sm">
        <p>© Adharv International 2025. All Rights Reserved.</p>
        <p className="mt-3 text-gray-600 text-xs">Handcrafted with ❤️ in India</p>
      </div>
    </footer>
  );
}
