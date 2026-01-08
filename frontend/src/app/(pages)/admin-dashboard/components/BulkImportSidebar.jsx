import { useState } from "react";
import { FileSpreadsheet } from "lucide-react";

export default function BulkImportSidebar({ setProducts, setStats, setActiveTab }) {
  const [file, setFile] = useState(null);
  const [message, setMessage] = useState("");

  const handleBulkImport = async () => {
    if (!file) {
      setMessage("Please select an Excel file first.");
      return;
    }
    try {
      const formData = new FormData();
      formData.append("file", file);
      const res = await fetch("http://localhost:5000/api/products/bulk-import", {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      if (!res.ok) {
        console.error("Bulk import error", data);
        setMessage(`Bulk import failed: ${data.error || "Unknown error"}`);
        return;
      }
      setMessage(`Bulk import complete! Inserted ${data.inserted || 0} products.`);
      setFile(null);
      
      // Refresh products
      const res2 = await fetch("http://localhost:5000/api/products");
      const data2 = await res2.json();
      setProducts(data2.products || []);
      setStats(data2.stats || { total: 0, categories: 0, active: 0 });
      setActiveTab("manage");
    } catch (err) {
      console.error("Bulk import fetch error", err);
      setMessage("Bulk import failed. Check console for details.");
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-xl p-6">
      <div className="flex items-center gap-2 mb-4">
        <FileSpreadsheet className="w-6 h-6 text-[#B8860B]" />
        <h3 className="font-bold text-lg text-gray-800">Bulk Import</h3>
      </div>
      <input
        type="file"
        accept=".xlsx,.xls"
        onChange={(e) => setFile(e.target.files[0])}
        className="w-full px-4 py-3 border-2 border-dashed border-gray-300 rounded-xl text-gray-800 text-sm file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-sm file:font-semibold file:bg-[#562D1D] file:text-white hover:file:bg-[#562D1D] mb-3"
      />
      <button
        type="button"
        className="w-full bg-[#562D1D] hover:[#562D1D]  text-white font-semibold py-3 px-4 rounded-xl shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300"
        onClick={handleBulkImport}
      >
        Import Products
      </button>
      {message && (
        <div className="mt-3 text-xs text-gray-600 bg-gray-50 p-2 rounded">
          {message}
        </div>
      )}
    </div>
  );
}
