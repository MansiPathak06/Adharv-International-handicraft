import { Filter } from "lucide-react";

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

export default function CategoryFilter({
  selectedCategory,
  setSelectedCategory,
  categoryCounts,
}) {
  return (
    <div className="mb-8 p-6 bg-[#FAF5ED] rounded-2xl border-2 border-[#562D1D]/20 shadow-lg">
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
        <div className="flex items-center gap-2 px-4 py-2 bg-white rounded-xl shadow-sm">
          <Filter className="w-5 h-5 text-[#B8860B]" />
          <span className="font-semibold text-gray-700">Filter by Category</span>
        </div>
        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="px-6 py-3 rounded-2xl border-2 border-gray-200 font-semibold focus:border-[#B8860B] focus:ring-2 focus:ring-[#B8860B]/20 focus:outline-none bg-white shadow-lg hover:shadow-md transition-all min-w-[250px]"
        >
          <option value="all">
            All Categories ({categoryCounts.all || 0})
          </option>
          {CATEGORY_OPTIONS.map((cat) => (
            <option key={cat} value={cat}>
              {cat} ({categoryCounts[cat] || 0})
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}
