
"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import DashboardHeader from "./components/DashboardHeader";
import DashboardTabs from "./components/DashboardTabs";
import OrdersTab from "./components/OrdersTab";
import AddProductTab from "./components/AddProductTab";
import ManageProductsTab from "./components/ManageProductsTab";

export default function AdminDashboard() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("add");
  const [products, setProducts] = useState([]);
  const [stats, setStats] = useState({ total: 0, categories: 0, active: 0 });
  const [message, setMessage] = useState("");
  const [editingProduct, setEditingProduct] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const userEmail = localStorage.getItem("userEmail");
    if (!token || !userEmail) {
      router.replace("/auth");
      return;
    }
    if (userEmail !== "team.zentrixinfotech@gmail.com") {
      router.replace("/auth");
    }
  }, [router]);

  useEffect(() => {
    async function fetchProducts() {
      const res = await fetch("http://localhost:5000/api/products");
      const data = await res.json();
      setProducts(data.products || []);
      setStats(data.stats || { total: 0, categories: 0, active: 0 });
    }
    if (activeTab === "manage") fetchProducts();
  }, [activeTab]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userEmail");
    localStorage.removeItem("username");
    router.replace("/auth");
  };
   // ✅ ADD THIS FUNCTION
  const handleEditProduct = (product) => {
    setEditingProduct(product);
    setActiveTab('add'); // Switch to add tab
  };

  // ✅ ADD THIS FUNCTION
  const clearEditingProduct = () => {
    setEditingProduct(null);
  };

  return (
    <div className="min-h-screen py-8 px-4 bg-[#FAF5ED]">
      <DashboardHeader onLogout={handleLogout} />
      
      <DashboardTabs activeTab={activeTab} setActiveTab={setActiveTab} />

      <div className="max-w-7xl mx-auto">
        {activeTab === "orders" && <OrdersTab />}
        
        {activeTab === "add" && (
          <AddProductTab
            setActiveTab={setActiveTab}
            setProducts={setProducts}
            setStats={setStats}
             editingProduct={editingProduct} // ✅ PASS THIS
            clearEditingProduct={clearEditingProduct} // ✅ PASS THIS
          />
        )}

        {activeTab === "manage" && (
          <ManageProductsTab
            products={products}
            setProducts={setProducts}
            message={message}
            setMessage={setMessage}
             setActiveTab={setActiveTab} // ✅ PASS THIS
            onEditProduct={handleEditProduct} // ✅ PASS THIS
          />
        )}
      </div>
    </div>
  );
}

