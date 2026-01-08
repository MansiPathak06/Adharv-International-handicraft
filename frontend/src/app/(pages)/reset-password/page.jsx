'use client';
import React, { useState } from 'react';
import { useSearchParams } from 'next/navigation';

export default function ResetPasswordPage() {
  const params = useSearchParams();
  const email = params.get('email');
  const token = params.get('token');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const handleReset = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');
    if (!password || password.length < 8)
      return setMessage('Password must be at least 8 characters.');
    try {
      const res = await fetch('http://localhost:5000/api/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, token, password }),
      });
      const data = await res.json();
      setLoading(false);
      if (data.success) setMessage('Password reset! You can login now.');
      else setMessage(data.error || 'Reset failed.');
    } catch (err) {
      setLoading(false);
      setMessage('Server error.');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <form
        onSubmit={handleReset}
        className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full"
      >
        <h2 className="text-2xl font-bold text-center mb-6 text-[#562D1D]">Reset Your Password</h2>
        <input
          type="password"
          className="w-full px-4 py-3 border rounded-lg mb-4"
          placeholder="Enter new password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          required
        />
        <button
          type="submit"
          className="w-full py-3 rounded-lg font-semibold placeholder-gray-500 text-gray-900 text-white bg-gradient-to-r from-[#562D1D] to-[#b8860b] shadow-lg transition-transform hover:scale-105"
          disabled={loading}
        >
          {loading ? 'Processing...' : 'Reset Password'}
        </button>
        {message && (
          <div className={`mt-5 text-center font-bold ${message.includes('success') ? 'text-[#562D1D]' : 'text-red-500'}`}>{message}</div>
        )}
      </form>
    </div>
  );
}
