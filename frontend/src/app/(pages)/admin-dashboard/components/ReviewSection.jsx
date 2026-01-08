import { Star } from "lucide-react";

export default function ReviewSection({ form, setForm }) {
  return (
    <div className="bg-[#FAF5ED] rounded-xl p-6 border border-[#562D1D]/20">
      <div className="flex items-center gap-2 mb-4">
        <Star className="w-5 h-5 text-[#B8860B]" />
        <h3 className="text-lg font-bold text-gray-800">Product Review</h3>
      </div>
      <div className="grid md:grid-cols-2 gap-4">
        <input
          type="text"
          value={form.reviewername}
          onChange={(e) => setForm((f) => ({ ...f, reviewername: e.target.value }))}
          placeholder="Reviewer Name"
          className="px-4 py-3 placeholder-gray-400 text-gray-800 rounded-xl border-2 border-gray-200 w-full focus:border-[#B8860B] focus:ring-2 focus:ring-[#B8860B]/20 focus:outline-none"
        />
        <input
          type="number"
          min="1"
          max="5"
          value={form.rating}
          onChange={(e) => setForm((f) => ({ ...f, rating: e.target.value }))}
          placeholder="Rating (1-5)"
          className="px-4 py-3 placeholder-gray-400 text-gray-800 rounded-xl border-2 border-gray-200 w-full focus:border-[#B8860B] focus:ring-2 focus:ring-[#B8860B]/20 focus:outline-none"
        />
      </div>
      <textarea
        value={form.reviewtext}
        onChange={(e) => setForm((f) => ({ ...f, reviewtext: e.target.value }))}
        rows={3}
        placeholder="Review text..."
        className="w-full px-4 py-3 placeholder-gray-400 text-gray-800 rounded-xl border-2 border-gray-200 mt-4 focus:border-[#B8860B] focus:ring-2 focus:ring-[#B8860B]/20 focus:outline-none"
      />
    </div>
  );
}
