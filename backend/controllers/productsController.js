// controllers/productsController.js
const xlsx = require('xlsx');
const db = require('../db'); // if you already use this elsewhere

exports.bulkImport = async (req, res) => {
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

    for (const prod of rows) {
      // basic validation
      if (!prod.name || !prod.category || !prod.price) continue;

      await db.query(
        `INSERT INTO products 
         (name, category, subcategory, price, discounted_price, short_desc, description,
          main_image, sub_image_1, sub_image_2, sub_image_3, review_text, rating, reviewer_name)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          prod.name,
          prod.category,
          prod.subcategory || null,
          prod.price,
          prod.discounted_price || null,
          prod.short_desc || null,
          prod.description || null,
          prod.main_image || null,
          prod.sub_image_1 || null,
          prod.sub_image_2 || null,
          prod.sub_image_3 || null,
          prod.review_text || null,
          prod.rating || null,
          prod.reviewer_name || null,
        ]
      );
      inserted += 1;
    }

    return res.json({ success: true, inserted });
  } catch (err) {
    console.error('Bulk import error:', err);
    return res.status(500).json({ error: 'Bulk import failed', details: err.message });
  }
};
