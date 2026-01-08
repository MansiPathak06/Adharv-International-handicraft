const express = require('express');
const router = express.Router();
const mysql = require('mysql2/promise');
const multer = require('multer');
const xlsx = require('xlsx');
const path = require('path');
const fs = require('fs');

// ✅ NEW CODE - Use this instead
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    // Keep original extension
    const ext = path.extname(file.originalname);
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + ext);
  }
});

const upload = multer({ storage: storage });

const db = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'anushka_handcraft'
});




const formatImageUrl = (imagePath) => {
  if (!imagePath) return null;
  if (imagePath.startsWith('http')) return imagePath;
  
  // Convert backslashes to forward slashes
  let cleanPath = imagePath.replace(/\\/g, '/');
  
  // Remove "uploads/" prefix if present (we'll add it back)
  cleanPath = cleanPath.replace(/^uploads\//, '');
  
  // Check if extension already exists
  const hasExtension = /\.(jpg|jpeg|png|gif|webp)$/i.test(cleanPath);
  
  if (!hasExtension) {
    // Try to find the file with different extensions
    const extensions = ['.png', '.jpg', '.jpeg', '.webp', '.gif'];
    
    for (const ext of extensions) {
      const fullPath = path.join(__dirname, '..', 'uploads', cleanPath + ext);
      if (fs.existsSync(fullPath)) {
        cleanPath = cleanPath + ext;
        break;
      }
    }
    
    // If no file found with any extension, default to .png
    if (!hasExtension && !/\.(jpg|jpeg|png|gif|webp)$/i.test(cleanPath)) {
      cleanPath = cleanPath + '.png';
    }
  }
  
  return `http://localhost:5000/uploads/${cleanPath}`;
};

// ✅ UPDATE GET ROUTE - Format image URLs before sending
router.get('/', async (req, res) => {
  try {
    const [products] = await db.query('SELECT * FROM products');
    
    // Format image URLs for each product
    const formattedProducts = products.map(product => ({
      ...product,
      main_image: formatImageUrl(product.main_image),
      sub_image_1: formatImageUrl(product.sub_image_1),
      sub_image_2: formatImageUrl(product.sub_image_2),
      sub_image_3: formatImageUrl(product.sub_image_3)
    }));
    
    const [cats] = await db.query('SELECT COUNT(DISTINCT category) AS count FROM products');
    const [active] = await db.query('SELECT COUNT(*) count FROM products WHERE active=1');
    
    res.json({
      products: formattedProducts, // ✅ Send formatted products
      stats: { total: products.length, categories: cats[0].count, active: active[0].count }
    });
  } catch (error) {
    console.error('GET products error:', error);
    res.status(500).json({ error: 'Failed to fetch products' });
  }
});

// Configure multer to accept image files
const productUpload = upload.fields([
  { name: 'main_image', maxCount: 1 },
  { name: 'sub_image_1', maxCount: 1 },
  { name: 'sub_image_2', maxCount: 1 },
  { name: 'sub_image_3', maxCount: 1 }
]);

// POST add product
router.post('/', productUpload, async (req, res) => {
  try {
    console.log('Request body:', req.body);
    console.log('Request files:', req.files);
    
    if (!req.body || !req.body.name || !req.body.category || !req.body.price) {
      return res.status(400).json({ error: 'Missing required fields: name, category, price' });
    }

    const {
      name, category, subcategory, price, discounted_price,
      short_desc, description, main_image, sub_image_1, sub_image_2, sub_image_3,
      review_text, rating, reviewer_name, stock
    } = req.body;

    const mainImagePath = req.files?.main_image?.[0]?.path || main_image || null;
    const subImage1Path = req.files?.sub_image_1?.[0]?.path || sub_image_1 || null;
    const subImage2Path = req.files?.sub_image_2?.[0]?.path || sub_image_2 || null;
    const subImage3Path = req.files?.sub_image_3?.[0]?.path || sub_image_3 || null;

    const stockValue = stock === 'true' || stock === true || stock === '1' || stock === 1 ? 1 : 0;

    const [result] = await db.query(
      'INSERT INTO products (name, category, subcategory, price, discounted_price, short_desc, description, main_image, sub_image_1, sub_image_2, sub_image_3, stock) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
      [name, category, subcategory || null, price, discounted_price || null, short_desc || null, description || null, mainImagePath, subImage1Path, subImage2Path, subImage3Path, stockValue]
    );

    if (review_text && reviewer_name) {
      await db.query(
        'INSERT INTO reviews (product_id, review_text, rating, reviewer_name) VALUES (?, ?, ?, ?)',
        [result.insertId, review_text, rating || 5, reviewer_name]
      );
    }
    
    res.json({ success: true, productId: result.insertId });
  } catch (error) {
    console.error('POST product error:', error);
    res.status(500).json({ error: 'Failed to add product', details: error.message });
  }
});

// PUT edit product
router.put('/:id', productUpload, async (req, res) => {
  try {
    const { id } = req.params;
    
    console.log('PUT Request body:', req.body);
    console.log('PUT Request files:', req.files);
    
    if (!req.body || !req.body.name || !req.body.category || !req.body.price) {
      return res.status(400).json({ error: 'Missing required fields: name, category, price' });
    }

    const {
      name, category, subcategory, price, discounted_price, short_desc, description,
      main_image, sub_image_1, sub_image_2, sub_image_3,
      review_text, rating, reviewer_name, stock
    } = req.body;

    const mainImagePath = req.files?.main_image?.[0]?.path || main_image || null;
    const subImage1Path = req.files?.sub_image_1?.[0]?.path || sub_image_1 || null;
    const subImage2Path = req.files?.sub_image_2?.[0]?.path || sub_image_2 || null;
    const subImage3Path = req.files?.sub_image_3?.[0]?.path || sub_image_3 || null;

    const stockValue = stock === 'true' || stock === true || stock === '1' || stock === 1 ? 1 : 0;

    await db.query(
      'UPDATE products SET name=?, category=?, subcategory=?, price=?, discounted_price=?, short_desc=?, description=?, main_image=?, sub_image_1=?, sub_image_2=?, sub_image_3=?, stock=? WHERE id=?',
      [name, category, subcategory || null, price, discounted_price || null, short_desc || null, description || null, mainImagePath, subImage1Path, subImage2Path, subImage3Path, stockValue, id]
    );

    res.json({ success: true });
  } catch (error) {
    console.error('PUT product error:', error);
    res.status(500).json({ error: 'Failed to update product', details: error.message });
  }
});

// DELETE product
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await db.query('DELETE FROM products WHERE id=?', [id]);
    res.json({ success: true });
  } catch (error) {
    console.error('DELETE product error:', error);
    res.status(500).json({ error: 'Failed to delete product', details: error.message });
  }
});

// Bulk Import
router.post('/bulk-import', upload.single('file'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded.' });
    }

    const workbook = xlsx.readFile(req.file.path);
    const sheet = workbook.Sheets[workbook.SheetNames[0]];
    const rows = xlsx.utils.sheet_to_json(sheet);

    if (!rows.length) {
      return res.status(400).json({ error: 'No rows found in sheet.' });
    }

    let inserted = 0;

    for (const row of rows) {
      const name = row['Product Name'];
      const category = row['Category'];
      const subcategory = row['Subcategory'] || null;
      const price = row['Original Price'];
      const discounted_price = row['Discounted Price'] || null;
      const short_desc = row['Short Description'] || null;
      const description = row['Full Description'] || null;
      const main_image = row['Main Image URL'] || null;
      const sub_image_1 = row['Sub Image 1 URL'] || null;
      const sub_image_2 = row['Sub Image 2 URL'] || null;
      const sub_image_3 = row['Sub Image 3 URL'] || null;
      const stock = row['In Stock'] === 'Yes' ? 1 : 0;

      if (!name || !category || !price) {
        console.log('Skipping row (missing required fields):', row);
        continue;
      }

      await db.query(
        `INSERT INTO products 
         (name, category, subcategory, price, discounted_price, short_desc, description,
          main_image, sub_image_1, sub_image_2, sub_image_3, stock)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          name,
          category,
          subcategory,
          Number(price),
          discounted_price ? Number(discounted_price) : null,
          short_desc,
          description,
          main_image,
          sub_image_1,
          sub_image_2,
          sub_image_3,
          stock,
        ]
      );

      inserted += 1;
    }

    return res.json({ success: true, inserted });
  } catch (err) {
    console.error('Bulk import error:', err);
    return res.status(500).json({ error: 'Bulk import failed', details: err.message });
  }
});

module.exports = router;
