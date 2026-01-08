'use client';
import React, { useEffect, useState } from "react";
import { useRouter } from 'next/navigation';

const CheckoutPage = () => {
  const [cartItems, setCartItems] = useState([]);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [placing, setPlacing] = useState(false);
  const [message, setMessage] = useState('');
  const [successOrder, setSuccessOrder] = useState(null);

  const [contactName, setContactName] = useState('');
  const [contactEmail, setContactEmail] = useState('');
  const [phone, setPhone] = useState('');

  const [country, setCountry] = useState('India');
  const [addressLine1, setAddressLine1] = useState('');
  const [addressLine2, setAddressLine2] = useState('');
  const [city, setCity] = useState('');
  const [stateName, setStateName] = useState('');
  const [pincode, setPincode] = useState('');

  const [paymentMode, setPaymentMode] = useState('UPI'); // 'UPI' or 'COD'

  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("token");
    const userEmail = localStorage.getItem("userEmail");
    const username = localStorage.getItem("username");

    if (!token || !userEmail) {
      setIsLoggedIn(false);
      setMessage('Please login to continue with checkout.');
      setTimeout(() => {
        router.replace('/auth');
      }, 2000);
      return;
    }

    setIsLoggedIn(true);
    const cartKey = `cartItems:${userEmail.toLowerCase()}`;
    const stored = JSON.parse(localStorage.getItem(cartKey) || '[]');
    setCartItems(stored);

    setContactEmail(userEmail);
    setContactName(username || userEmail.split('@')[0]);
  }, [router]);

  const cartTotal = cartItems.reduce((sum, item) => sum + item.price * item.qty, 0);

  const fullAddressString = [
    addressLine1,
    addressLine2,
    `${city} - ${pincode}`,
    stateName,
    country
  ].filter(Boolean).join(', ');

  const handlePlaceOrder = async () => {
    if (!isLoggedIn) {
      setMessage('You must be logged in to place an order.');
      return;
    }
    if (!contactName || !contactEmail || !phone || !addressLine1 || !city || !stateName || !pincode) {
      setMessage('Please fill in all required contact and address fields.');
      return;
    }
    if (cartItems.length === 0) {
      setMessage('Your cart is empty.');
      return;
    }

    setPlacing(true);
    setMessage('');
    const token = localStorage.getItem("token");
    const userEmail = localStorage.getItem("userEmail");

    const orderData = {
      user_email: userEmail,
      total: cartTotal,
      // store structured address + phone + paymentMode
      contact_name: contactName,
      contact_email: contactEmail,
      phone,
      country,
      address_line1: addressLine1,
      address_line2: addressLine2,
      city,
      state: stateName,
      pincode,
      payment_mode: paymentMode, // 'UPI' or 'COD'
      address: fullAddressString, // also keep combined string if you like
      items: cartItems.map(item => ({
        product_id: item.id,
        name: item.name,
        price: item.price,
        qty: item.qty,
      })),
    };

    const apiRes = await fetch('http://localhost:5000/api/orders', {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      },
      body: JSON.stringify(orderData)
    });

    const apiJson = await apiRes.json();
    setPlacing(false);

    if (apiJson.success) {
      setSuccessOrder(apiJson.order_id);
      setMessage('Order placed successfully! Redirecting to dashboard...');

      const cartKey = `cartItems:${userEmail.toLowerCase()}`;
      localStorage.removeItem(cartKey);
      window.dispatchEvent(new Event('cart-updated'));

      setTimeout(() => router.replace('/user-dashboard'), 2500);
    } else {
      setMessage(apiJson.error || 'Order could not be placed. Try again!');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-100 py-12 px-4">
      <div className="max-w-6xl w-full bg-white rounded-3xl shadow-2xl p-6 md:p-10 lg:p-12 border-2 border-amber-100">
        {/* Header */}
        <div className="text-center mb-8 relative">
          <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-16 text-6xl">
            🛒
          </div>
          <h2 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-[#b8860b] via-[#562D1D] to-[#b8860b] bg-clip-text text-transparent">
            Almost there! Complete your order
          </h2>
          <p className="mt-2 text-gray-600 text-sm md:text-base">
            Safe, secure and crafted just for you. Please review your details before placing the order.
          </p>
        </div>

        {!isLoggedIn ? (
          <div className="py-16 text-center">
            <p className="text-2xl font-bold text-red-600 mb-4">Please login to continue</p>
            <p className="text-gray-600 mb-8 text-lg">You need to be logged in to place an order</p>
            <button
              onClick={() => router.replace('/auth')}
              className="bg-gradient-to-r from-[#b8860b] to-[#562D1D] text-white font-bold py-4 px-10 rounded-xl shadow-lg hover:scale-105 hover:shadow-2xl transition-all duration-300"
            >
              Go to Login
            </button>
          </div>
        ) : cartItems.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-gray-500 text-lg">Your cart is empty.</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-[2fr_1.3fr] gap-8">
            {/* LEFT: contact + address + payment */}
            <div className="space-y-8">
              {/* Contact information */}
              <div className="border border-gray-200 rounded-2xl p-5 shadow-sm bg-amber-50/40">
                <h3 className="font-bold text-lg mb-3 text-gray-800">Contact information</h3>
                <p className="text-xs text-gray-500 mb-4">
                  We’ll use these details to send you order confirmations and delivery updates.
                </p>
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">
                      Full name
                    </label>
                    <input
                      type="text"
                      value={contactName}
                      onChange={e => setContactName(e.target.value)}
                      className="w-full border rounded-lg px-3 py-2 text-gray-800 text-sm focus:border-[#562D1D] focus:ring-2 focus:ring-[#562D1D]/20 outline-none"
                      placeholder="Your full name"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">
                      Email address
                    </label>
                    <input
                      type="email"
                      value={contactEmail}
                      readOnly
                      className="w-full border rounded-lg px-3 py-2 text-sm bg-gray-100 text-gray-500 cursor-not-allowed"
                    />
                  </div>
                </div>
                <div className="mt-4">
                  <label className="block text-xs font-semibold text-gray-700 mb-1">
                    Mobile number
                  </label>
                  <input
                    type="tel"
                    value={phone}
                    onChange={e => setPhone(e.target.value)}
                    className="w-full border rounded-lg px-3 py-2 text-gray-800 text-sm focus:border-[#562D1D] focus:ring-2 focus:ring-[#562D1D]/20 outline-none"
                    placeholder="10-digit mobile number"
                  />
                </div>
              </div>

              {/* Shipping address */}
              <div className="border border-gray-200 rounded-2xl p-5 shadow-sm">
                <h3 className="font-bold text-lg mb-3 text-gray-800">Shipping address</h3>
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">
                      Country / Region
                    </label>
                    <select
                      value={country}
                      onChange={e => setCountry(e.target.value)}
                      className="w-full border text-gray-800 rounded-lg px-3 py-2 text-sm focus:border-[#562D1D] focus:ring-2 focus:ring-[#562D1D]/20 outline-none"
                    >
                      <option value="India">India</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                </div>

                <div className="mt-4">
                  <label className="block text-xs font-semibold text-gray-700 mb-1">
                    Address line 1
                  </label>
                  <input
                    type="text"
                    value={addressLine1}
                    onChange={e => setAddressLine1(e.target.value)}
                    className="w-full border rounded-lg px-3 py-2 text-gray-800 text-sm focus:border-[#562D1D] focus:ring-2 focus:ring-[#562D1D]/20 outline-none"
                    placeholder="House no, building, street"
                  />
                </div>
                <div className="mt-3">
                  <label className="block text-xs font-semibold text-gray-700 mb-1">
                    Address line 2 (optional)
                  </label>
                  <input
                    type="text"
                    value={addressLine2}
                    onChange={e => setAddressLine2(e.target.value)}
                    className="w-full border rounded-lg px-3 py-2 text-gray-800 text-sm focus:border-[#562D1D] focus:ring-2 focus:ring-[#562D1D]/20 outline-none"
                    placeholder="Apartment, landmark, area"
                  />
                </div>

                <div className="grid md:grid-cols-2 gap-4 mt-3">
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">
                      City
                    </label>
                    <input
                      type="text"
                      value={city}
                      onChange={e => setCity(e.target.value)}
                      className="w-full border rounded-lg px-3 py-2 text-sm focus:border-[#562D1D] focus:ring-2 focus:ring-[#562D1D]/20 outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">
                      State
                    </label>
                    <input
                      type="text"
                      value={stateName}
                      onChange={e => setStateName(e.target.value)}
                      className="w-full border rounded-lg px-3 py-2 text-sm focus:border-[#562D1D] focus:ring-2 focus:ring-[#562D1D]/20 outline-none"
                    />
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-4 mt-3">
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">
                      PIN code
                    </label>
                    <input
                      type="text"
                      value={pincode}
                      onChange={e => setPincode(e.target.value)}
                      className="w-full border rounded-lg px-3 py-2 text-sm focus:border-[#562D1D] focus:ring-2 focus:ring-[#562D1D]/20 outline-none"
                    />
                  </div>
                </div>
              </div>

              {/* Payment options */}
              <div className="border border-gray-200 rounded-2xl p-5 shadow-sm">
                <h3 className="font-bold text-lg mb-3 text-gray-800">Payment options</h3>
                <div className="space-y-3 text-sm">
                  <label className={`flex items-center justify-between border rounded-xl px-4 py-3 cursor-pointer ${paymentMode === 'UPI' ? 'border-[#562D1D] bg-amber-50' : 'border-gray-200'}`}>
                    <div className="flex items-center gap-3">
                      <input
                        type="radio"
                        name="payment"
                        value="UPI"
                        checked={paymentMode === 'UPI'}
                        onChange={() => setPaymentMode('UPI')}
                      />
                      <div>
                        <div className="font-semibold text-gray-800">Pay Online (UPI / Card / NetBanking)</div>
                        <div className="text-xs text-gray-500">Securely via Razorpay / your payment gateway</div>
                      </div>
                    </div>
                    <span className="text-xs font-semibold text-green-600">FREE</span>
                  </label>

                  <label className={`flex items-center justify-between border rounded-xl px-4 py-3 cursor-pointer ${paymentMode === 'COD' ? 'border-[#562D1D] bg-amber-50' : 'border-gray-200'}`}>
                    <div className="flex items-center gap-3">
                      <input
                        type="radio"
                        name="payment"
                        value="COD"
                        checked={paymentMode === 'COD'}
                        onChange={() => setPaymentMode('COD')}
                      />
                      <div>
                        <div className="font-semibold text-gray-800">Cash on Delivery</div>
                        <div className="text-xs text-gray-500">Pay in cash when your order arrives</div>
                      </div>
                    </div>
                    <span className="text-xs font-semibold text-gray-600">₹0 COD fee (intro offer)</span>
                  </label>
                </div>
              </div>
            </div>

            {/* RIGHT: order summary + address view + place order */}
            <div className="space-y-5">
              <div className="border border-gray-200 rounded-2xl p-5 shadow-sm bg-amber-50/40">
                <h3 className="font-bold text-lg mb-3 text-gray-800">Order summary</h3>
                <div className="space-y-3 max-h-60 overflow-y-auto pr-1">
                  {cartItems.map(item => (
                    <div key={item.id} className="flex justify-between items-center text-sm">
                      <div className="flex items-center gap-2">
                        <img src={item.image} alt={item.name} className="w-10 h-10 rounded-lg object-cover" />
                        <div>
                          <div className="font-semibold text-gray-800 line-clamp-1">{item.name}</div>
                          <div className="text-xs text-gray-500">Qty: {item.qty}</div>
                        </div>
                      </div>
                      <div className="font-semibold text-gray-800">
                        ₹{item.price * item.qty}
                      </div>
                    </div>
                  ))}
                </div>
                <div className="mt-3 border-t border-dashed pt-3 text-sm space-y-1">
                  <div className="flex justify-between text-gray-600">
                    <span>Subtotal</span>
                    <span>₹{cartTotal}</span>
                  </div>
                  <div className="flex justify-between text-gray-600">
                    <span>Shipping</span>
                    <span className="text-green-600 font-semibold">FREE</span>
                  </div>
                  <div className="flex justify-between font-bold text-gray-900 text-base pt-1">
                    <span>Total</span>
                    <span>₹{cartTotal}</span>
                  </div>
                </div>
              </div>

              <div className="border border-gray-200 rounded-2xl p-5 shadow-sm text-sm">
                <h4 className="font-bold text-gray-800 mb-2">Delivering to</h4>
                {fullAddressString ? (
                  <div className="text-gray-700 leading-snug">
                    <div className="font-semibold">{contactName}</div>
                    <div>{fullAddressString}</div>
                    <div className="mt-1 text-xs text-gray-500">Phone: {phone || '—'}</div>
                  </div>
                ) : (
                  <div className="text-gray-400 text-xs">
                    Enter your address details on the left to see it here.
                  </div>
                )}
              </div>

              <div className="space-y-3">
                <button
                  disabled={placing}
                  onClick={handlePlaceOrder}
                  className="w-full bg-gradient-to-r from-[#b8860b] to-[#562D1D] text-white font-semibold py-3 rounded-xl shadow-lg hover:scale-105 transition-all disabled:opacity-50"
                >
                  {placing ? 'Placing your order...' : 'Place Order'}
                </button>
                <p className="text-[11px] text-gray-500 text-center">
                  By placing your order you agree to our Terms & Conditions and Privacy Policy.
                  You’ll receive an email confirmation with your order details.
                </p>
              </div>

              {message && (
                <div
                  className={`w-full py-3 px-4 text-center text-sm font-semibold rounded-xl ${
                    successOrder
                      ? 'bg-green-50 text-green-700 border border-green-200'
                      : 'bg-red-50 text-red-700 border border-red-200'
                  }`}
                >
                  {message}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CheckoutPage;
