import { Edit, Trash2, CheckSquare, Square } from "lucide-react";

export default function ProductCard({ product, onDelete, onEdit, onStockToggle }) {
  const getImageUrl = (img) => {
    if (!img) return null;
    return img.startsWith("http") ? img : `http://localhost:5000/${img}`;
  };

  return (
    <div className="flex items-center justify-between p-6 bg-gradient-to-r from-white to-[#FAF5ED]/50 rounded-2xl border-2 border-gray-100 hover:border-[#B8860B] hover:shadow-2xl hover:scale-[1.02] transition-all duration-300 group">
      <div className="flex items-center gap-4 flex-1 min-w-0">
        {/* Product Image */}
        <div className="w-20 h-20 bg-gradient-to-br from-[#562D1D]/10 to-[#B8860B]/10 rounded-2xl flex items-center justify-center border-2 border-dashed border-gray-200 flex-shrink-0 group-hover:border-[#B8860B] transition-all">
          {product.main_image ? (
            <img
              src={getImageUrl(product.main_image)}
              alt={product.name}
              className="w-full h-full rounded-xl object-cover shadow-lg group-hover:shadow-xl transition-shadow"
            />
          ) : (
            <div className="text-2xl font-bold text-gray-400 group-hover:text-[#B8860B] transition-colors">
              {product.name.charAt(0).toUpperCase()}
            </div>
          )}
        </div>

        {/* Product Details */}
        <div className="min-w-0 flex-1">
          <h4 className="font-bold text-xl text-gray-800 truncate group-hover:text-[#B8860B] transition-colors mb-1">
            {product.name}
          </h4>
          <p className="text-sm text-gray-500 mb-2">
            {product.category}
            {product.subcategory && ` - ${product.subcategory}`}
          </p>
          <p className="text-2xl font-bold text-[#B8860B] mb-2">
            ₹{product.price}
            {product.discounted_price && (
              <span className="text-lg font-normal text-gray-500 line-through ml-2">
                ₹{product.discounted_price}
              </span>
            )}
          </p>

          {/* Stock Status */}
          <div className="flex items-center gap-2">
            <div
              className={`w-4 h-4 rounded-full shadow-sm ${
                product.stock
                  ? "bg-green-500 shadow-green-200"
                  : "bg-red-500 shadow-red-200"
              }`}
            ></div>
            <span
              className={`text-sm font-semibold px-2 py-1 rounded-full ${
                product.stock
                  ? "bg-green-100 text-green-800"
                  : "bg-red-100 text-red-800"
              }`}
            >
              {product.stock ? "In Stock" : "Out of Stock"}
            </span>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-2 ml-4 flex-shrink-0">
        {/* Stock Toggle */}
        <button
          className={`p-3 rounded-xl transition-all duration-200 hover:scale-110 shadow-md ${
            product.stock
              ? "bg-green-100 hover:bg-green-200 text-green-700 border-2 border-green-200 hover:border-green-300"
              : "bg-red-100 hover:bg-red-200 text-red-700 border-2 border-red-200 hover:border-red-300"
          }`}
          onClick={(e) => {
            e.stopPropagation();
            onStockToggle(product.id, product.stock);
          }}
          title={product.stock ? "Mark Out of Stock" : "Mark In Stock"}
        >
          {product.stock ? (
            <Square className="w-5 h-5" />
          ) : (
            <CheckSquare className="w-5 h-5" />
          )}
        </button>

        {/* Edit */}
        <button
          className="p-3 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white rounded-xl hover:scale-110 shadow-lg hover:shadow-xl transition-all duration-200"
          onClick={(e) => {
            e.stopPropagation();
            onEdit(product);
          }}
        >
          <Edit className="w-5 h-5" />
        </button>

        {/* Delete */}
        <button
          className="p-3 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white rounded-xl hover:scale-110 shadow-lg hover:shadow-xl transition-all duration-200"
          onClick={(e) => {
            e.stopPropagation();
            onDelete(product.id);
          }}
        >
          <Trash2 className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
}
