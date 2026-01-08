import { useState, useEffect } from "react";
import { Edit } from "lucide-react";
import CategoryFilter from "./CategoryFilter";
import ProductCard from "./ProductCard";

export default function ManageProductsTab({ products, setProducts, message, setMessage, setActiveTab,onEditProduct }) {
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [categoryCounts, setCategoryCounts] = useState({});

  

  useEffect(() => {
    const counts = { all: products.length };
    products.forEach((p) => {
      counts[p.category] = (counts[p.category] || 0) + 1;
    });
    setCategoryCounts(counts);
  }, [products]);

  const filteredProducts =
    selectedCategory === "all"
      ? products
      : products.filter((p) => p.category === selectedCategory);

  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this product?")) return;

    try {
      const res = await fetch(`http://localhost:5000/api/products/${id}`, {
        method: "DELETE",
      });
      if (res.ok) {
        setProducts(products.filter((p) => p.id !== id));
        setMessage("Product deleted successfully!");
      } else {
        setMessage("Failed to delete product");
      }
    } catch (error) {
      setMessage("Error deleting product");
    }
  };
  const handleEdit = (product) => {
    console.log("Edit product:", product);
    
    // ✅ Pass product data to parent
    if (onEditProduct) {
      onEditProduct(product);
    }
    
    // ✅ Switch to Add tab
    setActiveTab('add');
  };
  
  const handleStockToggle = async (productId, currentStock) => {
    const newStock = !currentStock;
    try {
      const res = await fetch(`http://localhost:5000/api/products/${productId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ stock: newStock }),
      });

      if (res.ok) {
        setProducts(
          products.map((p) => (p.id === productId ? { ...p, stock: newStock } : p))
        );
        setMessage(
          `Product ${newStock ? "marked in stock" : "marked out of stock"}!`
        );
      }
    } catch (error) {
      setMessage("Failed to update stock status");
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-xl p-8">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-3">
          <Edit className="w-6 h-6" />
          Manage Products
        </h2>
        <span className="text-sm text-gray-500 bg-[#FAF5ED] px-3 py-1 rounded-full">
          {filteredProducts.length} products shown
        </span>
      </div>

      <CategoryFilter
        selectedCategory={selectedCategory}
        setSelectedCategory={setSelectedCategory}
        categoryCounts={categoryCounts}
      />

      {message && (
        <div
          className={`p-4 rounded-xl mb-6 font-bold text-lg ${
            message.includes("stock") || message.includes("deleted")
              ? "bg-green-50 border-2 border-green-400 text-green-800"
              : "bg-red-50 border-2 border-red-400 text-red-800"
          }`}
        >
          {message}
        </div>
      )}

      <div className="space-y-4 min-h-[400px]">
        {filteredProducts.length === 0 ? (
          <div className="py-20 text-center">
            <div className="text-8xl mb-6 opacity-20 mx-auto w-32">📦</div>
            <h3 className="text-2xl font-bold text-gray-500 mb-2">
              No products found
            </h3>
            <p className="text-gray-400 text-lg">
              {selectedCategory === "all"
                ? "No products in database. Add your first product!"
                : `No products in ${selectedCategory} category.`}
            </p>
          </div>
        ) : (
          filteredProducts.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onDelete={handleDelete}
              onEdit={handleEdit}
              onStockToggle={handleStockToggle}
            />
          ))
        )}
      </div>
    </div>
  );
}
