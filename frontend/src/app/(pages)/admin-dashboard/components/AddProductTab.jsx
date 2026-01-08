import { useState, useEffect } from "react";
import ProductForm from "./ProductForm";
import BulkImportSidebar from "./BulkImportSidebar";
import QuickStats from "./QuickStats";

export default function AddProductTab({ 
  setActiveTab, 
  setProducts, 
  setStats,
  editingProduct,
  clearEditingProduct
}) {
  const [form, setForm] = useState({
    id: null,
    name: "",
    category: "",
    subcategory: "",
    price: "",
    discountedprice: "",
    shortdesc: "",
    description: "",
    mainimage: "",
    subimage1: "",
    subimage2: "",
    subimage3: "",
    reviewtext: "",
    rating: "",
    reviewername: "",
    stock: true,
  });

  const [imageFiles, setImageFiles] = useState({
    mainimage: null,
    subimage1: null,
    subimage2: null,
    subimage3: null,
  });

  const [imagePreviews, setImagePreviews] = useState({});
  const [message, setMessage] = useState("");

  // ✅ ADD THIS - Populate form when editing
  useEffect(() => {
    if (editingProduct) {
      console.log("Loading product for editing:", editingProduct);
      
      setForm({
        id: editingProduct.id,
        name: editingProduct.name || "",
        category: editingProduct.category || "",
        subcategory: editingProduct.subcategory || "",
        price: editingProduct.price?.toString() || "",
        discountedprice: editingProduct.discounted_price?.toString() || "",
        shortdesc: editingProduct.short_desc || "",
        description: editingProduct.description || "",
        mainimage: editingProduct.main_image || "",
        subimage1: editingProduct.sub_image_1 || "",
        subimage2: editingProduct.sub_image_2 || "",
        subimage3: editingProduct.sub_image_3 || "",
        reviewtext: editingProduct.review_text || "",
        rating: editingProduct.rating?.toString() || "",
        reviewername: editingProduct.reviewer_name || "",
        stock: editingProduct.stock !== false && editingProduct.stock !== 0,
      });

      // Set image previews
      const newPreviews = {};
      if (editingProduct.main_image) {
        newPreviews.mainimage = editingProduct.main_image;
      }
      if (editingProduct.sub_image_1) {
        newPreviews.subimage1 = editingProduct.sub_image_1;
      }
      if (editingProduct.sub_image_2) {
        newPreviews.subimage2 = editingProduct.sub_image_2;
      }
      if (editingProduct.sub_image_3) {
        newPreviews.subimage3 = editingProduct.sub_image_3;
      }
      setImagePreviews(newPreviews);

      setMessage(`📝 Editing: ${editingProduct.name}`);
    }
  }, [editingProduct]);

  const handleProductForm = async (e) => {
    e.preventDefault();
    setMessage("");

    if (!form.name || !form.category || !form.price) {
      setMessage("Please fill all required fields.");
      return;
    }

   

    const hasImageFiles = Object.values(imageFiles).some((file) => file !== null);
    const method = form.id ? "PUT" : "POST";
    const url = form.id
      ? `http://localhost:5000/api/products/${form.id}`
      : "http://localhost:5000/api/products";

    try {
      let body;
      let headers = {};

      if (hasImageFiles) {
        const formData = new FormData();
        formData.append("name", form.name);
        formData.append("category", form.category);
        if (form.subcategory) formData.append("subcategory", form.subcategory);
        formData.append("price", form.price);
        if (form.discountedprice) formData.append("discounted_price", form.discountedprice);
        if (form.shortdesc) formData.append("short_desc", form.shortdesc);
        if (form.description) formData.append("description", form.description);
        if (form.mainimage) formData.append("main_image", form.mainimage);
        if (form.subimage1) formData.append("sub_image_1", form.subimage1);
        if (form.subimage2) formData.append("sub_image_2", form.subimage2);
        if (form.subimage3) formData.append("sub_image_3", form.subimage3);
        if (form.reviewtext) formData.append("review_text", form.reviewtext);
        if (form.rating) formData.append("rating", form.rating);
        if (form.reviewername) formData.append("reviewer_name", form.reviewername);
        formData.append("stock", form.stock);

        Object.keys(imageFiles).forEach((key) => {
          if (imageFiles[key]) {
            const backendKey =
              key === "mainimage"
                ? "main_image"
                : key === "subimage1"
                ? "sub_image_1"
                : key === "subimage2"
                ? "sub_image_2"
                : "sub_image_3";
            formData.append(backendKey, imageFiles[key]);
          }
        });
        body = formData;
      } else {
        headers = { "Content-Type": "application/json" };
        body = JSON.stringify({
          name: form.name,
          category: form.category,
          subcategory: form.subcategory || null,
          price: form.price,
          discounted_price: form.discountedprice || null,
          short_desc: form.shortdesc || null,
          description: form.description || null,
          main_image: form.mainimage || null,
          sub_image_1: form.subimage1 || null,
          sub_image_2: form.subimage2 || null,
          sub_image_3: form.subimage3 || null,
          review_text: form.reviewtext || null,
          rating: form.rating || null,
          reviewer_name: form.reviewername || null,
          stock: form.stock,
        });
      }

      const res = await fetch(url, { method, headers, body });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || "Failed to save product");
      }

      setMessage(form.id ? "✅ Product updated successfully!" : "✅ Product added successfully!");

      // Reset form
      setForm({
        id: null,
        name: "",
        category: "",
        subcategory: "",
        price: "",
        discountedprice: "",
        shortdesc: "",
        description: "",
        mainimage: "",
        subimage1: "",
        subimage2: "",
        subimage3: "",
        reviewtext: "",
        rating: "",
        reviewername: "",
        stock: true,
      });
      setImageFiles({
        mainimage: null,
        subimage1: null,
        subimage2: null,
        subimage3: null,
      });
      setImagePreviews({});

      // ✅ Clear editing product state
      if (clearEditingProduct) {
        clearEditingProduct();
      }

      // Refresh products
      const refreshRes = await fetch("http://localhost:5000/api/products");
      const refreshData = await refreshRes.json();
      setProducts(refreshData.products || []);
      setStats(refreshData.stats || { total: 0, categories: 0, active: 0 });

      // Switch to manage tab after short delay
      setTimeout(() => {
        setActiveTab("manage");
      }, 1500);

    } catch (error) {
      setMessage(`❌ Error: ${error.message}`);
    }
  };

  // ✅ ADD THIS - Cancel edit button handler
  const handleCancelEdit = () => {
    setForm({
      id: null,
      name: "",
      category: "",
      subcategory: "",
      price: "",
      discountedprice: "",
      shortdesc: "",
      description: "",
      mainimage: "",
      subimage1: "",
      subimage2: "",
      subimage3: "",
      reviewtext: "",
      rating: "",
      reviewername: "",
      stock: true,
    });
    setImageFiles({
      mainimage: null,
      subimage1: null,
      subimage2: null,
      subimage3: null,
    });
    setImagePreviews({});
    setMessage("");
    
    if (clearEditingProduct) {
      clearEditingProduct();
    }
  };

  return (
    <form onSubmit={handleProductForm} className="grid lg:grid-cols-3 gap-6">
      <div className="lg:col-span-2">
        <ProductForm
          form={form}
          setForm={setForm}
          imageFiles={imageFiles}
          setImageFiles={setImageFiles}
          imagePreviews={imagePreviews}
          setImagePreviews={setImagePreviews}
          message={message}
          isEditing={!!editingProduct} // ✅ ADD THIS
          onCancelEdit={handleCancelEdit} // ✅ ADD THIS
        />
      </div>

      <div className="space-y-6">
        <BulkImportSidebar 
          setProducts={setProducts} 
          setStats={setStats} 
          setActiveTab={setActiveTab} 
        />
        <QuickStats />
      </div>
    </form>
  );
}
