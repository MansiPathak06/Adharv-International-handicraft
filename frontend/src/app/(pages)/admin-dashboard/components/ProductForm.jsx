import { Package, Image, X } from "lucide-react";
import ImageUploadSection from "./ImageUploadSection";
import ReviewSection from "./ReviewSection";

const CATEGORY_OPTIONS = [
 "Garden Accessories",
  "Candles and Fragrance",
  "Decoratives",
  "Table Tops",
  "Housewares",
  "Furniture",
  "Lightning",
  "Kitchenware",
  "Candle Stand and Holders",
];

export default function ProductForm({
  form,
  setForm,
  imageFiles,
  setImageFiles,
  imagePreviews,
  setImagePreviews,
  message,
  isEditing,
  onCancelEdit,
}) {
  const getSubcategoryOptions = () => {
    return SUBCATEGORIES[form.category] || [];
  };

  // ✅ VALIDATION: Check if discounted price is valid
  const getDiscountedPriceError = () => {
    const originalPrice = parseFloat(form.price) || 0;
    const discountedPrice = parseFloat(form.discountedprice) || 0;
    
    if (discountedPrice > 0 && discountedPrice >= originalPrice) {
      return "Discounted price must be less than original price";
    }
    return "";
  };

  const discountedPriceError = getDiscountedPriceError();

  return (
    <div className="bg-white rounded-2xl shadow-xl p-8">
      {/* Header with Cancel Button - UNCHANGED */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className={`p-2 rounded-lg ${
            isEditing 
              ? 'bg-gradient-to-br from-blue-500 to-purple-600' 
              : 'bg-[#562D1D] '
          }`}>
            <Package className="w-6 h-6 text-white" />
          </div>
          <h2 className="text-2xl font-bold">
            {isEditing ? (
              <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                ✏️ Edit Product
              </span>
            ) : (
              <span className="text-gray-800">➕ Add New Product</span>
            )}
          </h2>
        </div>

        {isEditing && onCancelEdit && (
          <button
            type="button"
            onClick={onCancelEdit}
            className="flex items-center gap-2 px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-xl font-semibold transition-all duration-200 hover:scale-105"
          >
            <X className="w-4 h-4" />
            Cancel
          </button>
        )}
      </div>

      {/* Editing Indicator - UNCHANGED */}
      {isEditing && form.name && (
        <div className="mb-6 p-4 bg-gradient-to-r from-blue-50 via-purple-50 to-pink-50 border-2 border-blue-300 rounded-xl shadow-md animate-pulse">
          <div className="flex items-center gap-3">
            <div className="flex-shrink-0 w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
              <span className="text-white text-xl">📝</span>
            </div>
            <div>
              <p className="text-sm font-semibold text-gray-600">Currently Editing:</p>
              <p className="text-lg font-bold bg-gradient-to-r from-blue-700 to-purple-700 bg-clip-text text-transparent">
                {form.name}
              </p>
            </div>
          </div>
        </div>
      )}

      <div className="space-y-5">
        {/* Basic Info - UNCHANGED */}
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Product Name *
            </label>
            <input
              type="text"
              required
              value={form.name}
              onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
              className="w-full px-4 py-3 placeholder-gray-400 text-gray-800 rounded-xl border-2 border-gray-200 focus:border-[#B8860B] focus:ring-2 focus:ring-[#B8860B]/20 focus:outline-none"
              placeholder="Enter product name"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Category *
            </label>
            <select
              required
              value={form.category}
              onChange={(e) =>
                setForm((f) => ({
                  ...f,
                  category: e.target.value,
                  subcategory: "",
                }))
              }
              className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 text-gray-800 focus:border-[#B8860B] focus:ring-2 focus:ring-[#B8860B]/20 focus:outline-none"
            >
              <option value="">Select Category</option>
              {CATEGORY_OPTIONS.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* ✅ UPDATED: Pricing with Validation */}
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Original Price (₹) *
            </label>
            <input
              type="number"
              required
              step="0.01"
              min="0"
              value={form.price}
              onChange={(e) => setForm((f) => ({ ...f, price: e.target.value }))}
              className="w-full px-4 py-3 placeholder-gray-400 text-gray-800 rounded-xl border-2 border-gray-200 focus:border-[#B8860B] focus:ring-2 focus:ring-[#B8860B]/20 focus:outline-none"
              placeholder="0.00"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Discounted Price (₹)
            </label>
            <input
              type="number"
              step="0.01"
              min="0"
              value={form.discountedprice}
              onChange={(e) =>
                setForm((f) => ({ ...f, discountedprice: e.target.value }))
              }
              className={`w-full px-4 py-3 placeholder-gray-400 text-gray-800 rounded-xl border-2 transition-all duration-200 focus:ring-2 focus:outline-none ${
                discountedPriceError
                  ? 'border-red-400 focus:border-red-500 focus:ring-red-500/20'
                  : 'border-gray-200 focus:border-[#B8860B] focus:ring-[#B8860B]/20'
              }`}
              placeholder="0.00"
            />
            {/* ✅ ERROR MESSAGE FOR INVALID DISCOUNTED PRICE */}
            {discountedPriceError && (
              <div className="mt-2 flex items-center gap-2 text-red-600 text-sm animate-shake">
                <span className="text-lg">⚠️</span>
                <span className="font-medium">{discountedPriceError}</span>
              </div>
            )}
            {/* ✅ DISCOUNT PERCENTAGE DISPLAY */}
            {!discountedPriceError && form.price && form.discountedprice && parseFloat(form.discountedprice) > 0 && (
              <div className="mt-2 flex items-center gap-2 text-green-600 text-sm">
                <span className="text-lg">✅</span>
                <span className="font-medium">
                  {Math.round(100 * (1 - parseFloat(form.discountedprice) / parseFloat(form.price)))}% discount
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Rest of the form - UNCHANGED */}
        <div>
          <label className="flex items-center gap-3 text-sm font-semibold text-gray-700 mb-2">
            <input
              type="checkbox"
              checked={form.stock}
              onChange={(e) => setForm((f) => ({ ...f, stock: e.target.checked }))}
              className="w-5 h-5 text-[#B8860B] bg-gray-100 border-gray-300 rounded focus:ring-[#B8860B] focus:ring-2 cursor-pointer"
            />
            In Stock
          </label>
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Short Description
          </label>
          <input
            type="text"
            value={form.shortdesc}
            onChange={(e) => setForm((f) => ({ ...f, shortdesc: e.target.value }))}
            className="w-full px-4 py-3 placeholder-gray-400 text-gray-800 rounded-xl border-2 border-gray-200 focus:border-[#B8860B] focus:ring-2 focus:ring-[#B8860B]/20 focus:outline-none"
            placeholder="Brief product tagline"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Full Description
          </label>
          <textarea
            value={form.description}
            onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
            rows={4}
            className="w-full px-4 py-3 placeholder-gray-400 text-gray-800 rounded-xl border-2 border-gray-200 focus:border-[#B8860B] focus:ring-2 focus:ring-[#B8860B]/20 focus:outline-none resize-vertical"
            placeholder="Detailed product description..."
          />
        </div>

        <ImageUploadSection
          imageFiles={imageFiles}
          setImageFiles={setImageFiles}
          imagePreviews={imagePreviews}
          setImagePreviews={setImagePreviews}
          form={form}
          setForm={setForm}
        />

        <ReviewSection form={form} setForm={setForm} />

        {/* ✅ UPDATED SUBMIT BUTTON WITH VALIDATION */}
        <button
          type="submit"
          disabled={!!discountedPriceError}
          className={`w-full font-bold py-4 px-6 rounded-xl shadow-lg transition-all duration-300 cursor-pointer flex items-center justify-center gap-2 text-lg ${
            discountedPriceError
              ? 'bg-gray-400 cursor-not-allowed opacity-60'
              : isEditing
              ? 'bg-gradient-to-r from-blue-500 via-purple-600 to-pink-600 hover:from-blue-600 hover:via-purple-700 hover:to-pink-700 hover:scale-102 hover:shadow-xl'
              : 'bg-[#562D1D] hover:from-[#B8860B] hover:to-[#562D1D] hover:scale-102 hover:shadow-xl'
          } text-white`}
        >
          <Package className="w-5 h-5" />
          {discountedPriceError ? '⚠️ Fix Price Error' : isEditing ? '💾 Update Product' : '➕ Add Product'}
        </button>

        {message && (
          <div
            className={`py-3 px-4 rounded-xl mt-6 font-bold text-lg animate-fade-in ${
              message.includes("success") ||
              message.includes("added") ||
              message.includes("updated") ||
              message.includes("✅")
                ? "bg-green-50 border-2 border-green-400 text-green-800"
                : message.includes("Editing") || message.includes("📝")
                ? "bg-blue-50 border-2 border-blue-400 text-blue-800"
                : "bg-red-50 border-2 border-red-400 text-red-800"
            }`}
          >
            {message}
          </div>
        )}
      </div>

      <style jsx>{`
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-5px); }
          75% { transform: translateX(5px); }
        }
        .animate-fade-in {
          animation: fade-in 0.3s ease-out;
        }
        .animate-shake {
          animation: shake 0.3s ease-in-out;
        }
      `}</style>
    </div>
  );
}
