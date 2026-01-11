import { Image } from "lucide-react";

export default function ImageUploadSection({
  imageFiles,
  setImageFiles,
  imagePreviews,
  setImagePreviews,
  form,
  setForm,
}) {
  const handleImageUpload = (key, file) => {
    if (file && file.type.startsWith("image/")) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreviews((prev) => ({ ...prev, [key]: e.target.result }));
        setImageFiles((prev) => ({ ...prev, [key]: file }));
        setForm((f) => ({ ...f, [key]: "" }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleImageUrlChange = (key, url) => {
    if (url) {
      setImagePreviews((prev) => ({ ...prev, [key]: url }));
      setImageFiles((prev) => ({ ...prev, [key]: null }));
    } else {
      setImagePreviews((prev) => ({ ...prev, [key]: null }));
    }
    setForm((f) => ({ ...f, [key]: url }));
  };

  const removeImage = (key) => {
    setImagePreviews((prev) => ({ ...prev, [key]: null }));
    setImageFiles((prev) => ({ ...prev, [key]: null }));
    setForm((f) => ({ ...f, [key]: "" }));
  };

  return (
    <div>
      <label className="block text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
        <Image className="w-5 h-5 text-[#B8860B]" />
        Product Images (Upload file or paste URL)
      </label>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {["mainimage", "subimage1", "subimage2", "subimage3"].map((imgKey) => (
          <div key={imgKey} className="space-y-2">
            {imagePreviews[imgKey] && (
              <div className="w-full h-24 bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl border-2 border-dashed border-gray-300 flex items-center justify-center overflow-hidden group relative">
                <img
                  src={imagePreviews[imgKey]}
                  alt="Preview"
                  className="w-full h-full object-cover"
                />
                <button
                  type="button"
                  onClick={() => removeImage(imgKey)}
                  className="absolute top-1 right-1 opacity-0 group-hover:opacity-100 bg-red-500 text-white w-6 h-6 rounded-full flex items-center justify-center text-xs hover:bg-red-600 transition-all"
                >
                  ×
                </button>
              </div>
            )}
            <input
              type="file"
              accept="image/*"
              onChange={(e) => handleImageUpload(imgKey, e.target.files[0])}
              className="w-full px-3 py-2 text-xs placeholder-gray-400 text-gray-800 rounded-xl border-2 border-gray-200 bg-white file:bg-[#562D1D] file:text-white file:border-0 file:rounded-lg file:px-3 file:py-1 file:cursor-pointer hover:file:from-[#562D1D] hover:file:to-[#B8860B] transition-all"
            />
            <input
              type="url"
              placeholder={
                imgKey === "mainimage"
                  ? "Main image URL"
                  : `Sub image ${imgKey.replace("subimage", "")} URL`
              }
              value={form[imgKey]}
              onChange={(e) => handleImageUrlChange(imgKey, e.target.value)}
              className="w-full px-3 py-2 text-xs placeholder-gray-400 text-gray-800 rounded-xl border-2 border-gray-200 focus:border-[#B8860B] focus:ring-1 focus:ring-[#B8860B]/20 bg-white"
            />
          </div>
        ))}
      </div>
    </div>
  );
}
