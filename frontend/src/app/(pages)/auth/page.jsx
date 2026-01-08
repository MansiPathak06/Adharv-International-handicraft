"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";

const bgImage =
  "https://i.pinimg.com/736x/75/92/2b/75922b076d6f0487fa54952a1ad86754.jpg";

export default function AuthPage() {
  const [mode, setMode] = useState("login");
  const [form, setForm] = useState({ username: "", email: "", password: "" });
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  // Check if user is already logged in on component mount
  useEffect(() => {
    const token = localStorage.getItem("token");
    const userEmail = localStorage.getItem("userEmail");

    if (token && userEmail) {
      // User is already logged in, redirect to appropriate dashboard
      if (userEmail === "team.zentrixinfotech@gmail.com") {
        router.push("/admin-dashboard");
      } else {
        router.push(
          `/user-dashboard?username=${encodeURIComponent(userEmail)}`
        );
      }
    }
  }, [router]);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const validateForm = () => {
    // Email pattern (simple RFC standard)
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    // Strong password: at least 8 chars, one uppercase, one lowercase, one digit, one symbol
    const passwordPattern =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    if (
      mode === "register" &&
      (form.username.length < 2 || form.username.length > 20)
    ) {
      setMessage("Username must be 2-20 characters.");
      return false;
    }
    if (!emailPattern.test(form.email)) {
      setMessage("Enter a valid email address.");
      return false;
    }
    if (!passwordPattern.test(form.password)) {
      setMessage(
        "Password must be 8+ chars, include upper/lowercase, number, and symbol."
      );
      return false;
    }
    return true;
  };

const handleSubmit = async (e) => {
  e.preventDefault();
  setLoading(true);
  setMessage("");
  if (!validateForm()) {
    setLoading(false);
    return;
  }

  const endpoint =
    mode === "login"
      ? "http://localhost:5000/api/login"
      : "http://localhost:5000/api/register";
  try {
    const res = await fetch(endpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    const data = await res.json();
    
    // DEBUG: Log the response
    console.log("Backend Response:", data);
    console.log("Has access_token?", !!data.access_token);
    
    setLoading(false);
    if (data.error) {
      setMessage(data.error);
    } else {
      setMessage(
        mode === "login" ? "Login successful!" : "Registration successful!"
      );
      
      // Check if we have a token
      if (data.access_token) {
        console.log("Storing token and redirecting...");
        // Store both token and email for persistence
        localStorage.setItem("token", data.access_token);
        localStorage.setItem("userEmail", form.email);
        if (form.username) {
          localStorage.setItem("username", form.username);
        }
        
        // REDIRECTION logic - works for BOTH login AND register
        if (form.email === "team.zentrixinfotech@gmail.com") {
          console.log("Redirecting to admin dashboard");
          router.push("/admin-dashboard");
        } else {
          console.log("Redirecting to user dashboard");
          router.push(
            `/user-dashboard?username=${encodeURIComponent(form.email)}`
          );
        }
      } else {
        console.error("No access_token in response!");
        setMessage("Login successful!")
        // setMessage("Login successful but no token received. Please try again.");
      }
    }
  } catch (err) {
    console.error("Fetch error:", err);
    setLoading(false);
    setMessage("Server connection failed. Please check backend.");
  }
};

  const formVariants = {
    initial: { opacity: 0, y: 30, scale: 0.98 },
    animate: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: { duration: 0.7, ease: "easeOut" },
    },
    exit: {
      opacity: 0,
      y: -30,
      scale: 0.98,
      transition: { duration: 0.35, ease: "easeIn" },
    },
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center bg-fixed bg-contain"
      style={{ backgroundImage: `url(${bgImage})` }}
    >
      <div
        className="absolute inset-0 z-0"
        style={{ pointerEvents: "none" }}
      />
      <motion.div
        initial={{ y: 60, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ type: "spring", stiffness: 80, damping: 15 }}
        className="relative z-10 w-full max-w-md p-8 rounded-2xl shadow-2xl bg-white/90 backdrop-blur-lg"
      >
        <AnimatePresence mode="wait">
          <motion.div
            key={mode}
            variants={formVariants}
            initial="initial"
            animate="animate"
            exit="exit"
          >
            <div className="flex items-center justify-center mb-8">
              <img
                src="https://i.pinimg.com/736x/43/14/0a/43140a3803e5f1b39c1ffac1a35a3ec7.jpg"
                alt="Auth"
                className="w-16 h-1 rounded-full shadow-lg object-fit border-2 border-[#562D1D] bg-white"
              />
            </div>
            <h2 className="text-2xl font-extrabold mb-2 text-center text-[#562D1D] drop-shadow-[0_2px_6px_rgba(205,155,77,0.18)]">
              {mode === "login" ? "Welcome Back!" : "Join Us!"}
            </h2>
            <p className="text-sm text-gray-600 text-center mb-6 transition-opacity duration-700">
              {mode === "login"
                ? "Sign in to explore timeless craftsmanship."
                : "Create your account to discover exclusive brass art."}
            </p>
            {mode === "forgot" ? (
              <form
                onSubmit={async (e) => {
                  e.preventDefault();
                  // Simple email check
                  if (
                    !form.email ||
                    !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)
                  ) {
                    setMessage("Enter a valid email.");
                    return;
                  }
                  setLoading(true);
                  setMessage("");
                  // Backend must handle this route and send reset email
                  const res = await fetch(
                    "http://localhost:5000/api/forgot-password",
                    {
                      method: "POST",
                      headers: { "Content-Type": "application/json" },
                      body: JSON.stringify({ email: form.email }),
                    }
                  );
                  const data = await res.json();
                  setLoading(false);
                  setMessage(
                    data.success
                      ? "Password reset link sent to your email!"
                      : data.error || "Unable to send reset link."
                  );
                }}
                className="space-y-6"
              >
                <label
                  htmlFor="fp-email"
                  className="block text-sm font-medium text-[#b8860b] mb-1"
                >
                  Your Email
                </label>
                <input
                  id="fp-email"
                  type="email"
                  name="email"
                  placeholder="Enter your email"
                  value={form.email}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 placeholder-gray-500 text-gray-700 rounded-lg focus:ring-2"
                />
                <motion.button
                  type="submit"
                  className="w-full py-3 rounded-lg font-semibold text-white bg-gradient-to-r from-[#562D1D] to-[#b8860b] shadow-lg hover:scale-105 transition-transform"
                  whileTap={{ scale: 0.97 }}
                  disabled={loading}
                >
                  {loading ? "Processing..." : "Send Reset Link"}
                </motion.button>
                <div className="text-center mt-3">
                  <button
                    type="button"
                    onClick={() => setMode("login")}
                    className="text-[#562D1D] hover:underline font-bold transition"
                  >
                    Back to Login
                  </button>
                </div>
              </form>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                {mode === "register" && (
                  <div>
                    <label
                      htmlFor="username"
                      className="block text-sm font-medium text-[#b8860b] mb-1"
                    >
                      Username
                    </label>
                    <input
                      id="username"
                      type="text"
                      name="username"
                      placeholder="Choose a username"
                      value={form.username}
                      onChange={handleChange}
                      required
                      minLength={2}
                      maxLength={20}
                      className="w-full px-4 py-3 border border-gray-300 placeholder-gray-500 text-gray-700 rounded-lg focus:ring-2 focus:ring-[#562D1D] focus:border-[#562D1D] transition"
                    />
                  </div>
                )}

                <div>
                  <label
                    htmlFor="email"
                    className="block text-sm font-medium text-[#b8860b] mb-1"
                  >
                    Email Address
                  </label>
                  <input
                    id="email"
                    type="email"
                    name="email"
                    placeholder="Enter your email"
                    value={form.email}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 placeholder-gray-500 text-gray-700 rounded-lg focus:ring-2 focus:ring-[#562D1D] focus:border-[#562D1D] transition"
                  />
                </div>
                <div>
                  <label
                    htmlFor="password"
                    className="block text-sm font-medium text-[#b8860b] mb-1"
                  >
                    Password
                  </label>
                  <input
                    id="password"
                    type="password"
                    name="password"
                    placeholder="Enter your password"
                    value={form.password}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border placeholder-gray-500 text-gray-700 border-gray-300 rounded-lg focus:ring-2 focus:ring-[#562D1D] focus:border-[#562D1D] transition"
                  />
                </div>
                {mode === "login" && (
                  <div className="text-right">
                    <button
                      type="button"
                      className="text-xs text-blue-600 hover:underline"
                      onClick={() => setMode("forgot")}
                    >
                      Forgot password?
                    </button>
                  </div>
                )}

                <motion.button
                  type="submit"
                  className={`w-full py-3 rounded-lg font-semibold text-white bg-gradient-to-r from-[#562D1D] to-[#b8860b] shadow-lg transition-transform hover:scale-105`}
                  whileTap={{ scale: 0.97 }}
                  disabled={loading}
                >
                  {loading ? (
                    <span className="animate-pulse">Loading...</span>
                  ) : mode === "login" ? (
                    "Login"
                  ) : (
                    "Register"
                  )}
                </motion.button>
              </form>
            )}
            <div className="text-center mt-5">
              <button
                onClick={() => setMode(mode === "login" ? "register" : "login")}
                className="text-[#562D1D] hover:underline font-bold transition"
              >
                {mode === "login"
                  ? "Don't have an account? Register"
                  : "Already registered? Login"}
              </button>
            </div>
            {message && (
              <motion.p
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className={`mt-6 text-center font-bold ${
                  message.includes("successful")
                    ? "text-[#562D1D]"
                    : "text-red-500"
                }`}
              >
                {message}
              </motion.p>
            )}
          </motion.div>
        </AnimatePresence>
        <div className="h-4" />
        <div className="text-xs text-gray-400 text-center">
          © {new Date().getFullYear()} Adharv International. Crafted with
          passion.
        </div>
      </motion.div>
    </div>
  );
}
