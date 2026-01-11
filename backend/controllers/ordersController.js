const db = require('../db');
const jwt = require('jsonwebtoken');
const transporter = require('../mailer');
const PDFDocument = require('pdfkit'); // Install: npm install pdfkit

// User dashboard: get orders for current user
exports.getUserOrders = async (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      return res.status(401).json({ error: 'No authorization header' });
    }

    const token = authHeader.replace('Bearer ', '');
    if (!token) {
      return res.status(401).json({ error: 'No token provided' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your_jwt_secret');
    const userEmail = decoded.email;

    if (!userEmail) {
      return res.status(401).json({ error: 'Invalid token - no email found' });
    }

    const [users] = await db.query('SELECT id FROM users WHERE email = ?', [userEmail]);
    if (users.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    const userId = users[0].id;

    const [orders] = await db.query(
      'SELECT * FROM orders WHERE user_id = ? ORDER BY created_at DESC',
      [userId]
    );

    for (const order of orders) {
      const [items] = await db.query(
        `SELECT oi.*, p.main_image 
         FROM order_items oi
         LEFT JOIN products p ON oi.product_id = p.id
         WHERE oi.order_id = ?`,
        [order.id]
      );
      order.items = items;
    }

    res.json({ orders, updates: [] });
  } catch (error) {
    console.error('Error in getUserOrders:', error);
    res.status(500).json({ error: 'Failed to fetch orders', details: error.message });
  }
};

// Create new order from checkout
exports.createOrder = async (req, res) => {
  try {
    const {
      user_email,
      total,
      address,
      contact_name,
      contact_email,
      phone,
      country,
      address_line1,
      address_line2,
      city,
      state,
      pincode,
      payment_mode,
      items
    } = req.body;

    if (!user_email || !items || !items.length) {
      return res.status(400).json({ error: 'Missing order data.' });
    }

    const [users] = await db.query('SELECT id FROM users WHERE email = ?', [user_email]);
    if (users.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }
    const user_id = users[0].id;

    const [result] = await db.query(
      `INSERT INTO orders 
       (user_id, contact_name, contact_email, phone, country,
        address_line1, address_line2, city, state, pincode,
        address, total, payment_mode, status)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        user_id,
        contact_name || null,
        contact_email || user_email,
        phone || null,
        country || 'India',
        address_line1 || null,
        address_line2 || null,
        city || null,
        state || null,
        pincode || null,
        address || null,
        total,
        payment_mode || 'UPI',
        'Placed'
      ]
    );

    const orderId = result.insertId;

    for (const item of items) {
      await db.query(
        'INSERT INTO order_items (order_id, product_id, name, price, qty) VALUES (?, ?, ?, ?, ?)',
        [orderId, item.product_id, item.name, item.price, item.qty]
      );
    }
// Send order placed email to admin - COMPLETE RICH TEMPLATE
try {
  await transporter.sendMail({
    from: process.env.EMAIL_USER,
    to: 'team.zentrixinfotech@gmail.com',
    subject: `🆕 NEW ORDER #${orderId} - ₹${total} by ${contact_name || user_email}`,
    html: `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <style>
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; }
        .header { background: linear-gradient(135deg, #562D1D 0%, #B8860B 100%); color: white; padding: 2rem; text-align: center; }
        .order-card { background: #FAF5ED; border: 2px solid #562D1D20; border-radius: 16px; padding: 1.5rem; margin: 1rem 0; }
        .highlight { background: white; padding: 1rem; border-radius: 12px; border-left: 4px solid #B8860B; margin: 1rem 0; }
        .status { padding: 0.5rem 1rem; border-radius: 999px; font-weight: bold; color: white; }
        .status.placed { background: #F59E0B; }
        table { width: 100%; border-collapse: collapse; margin: 1rem 0; }
        th, td { padding: 0.75rem; text-align: left; border-bottom: 1px solid #E5E7EB; }
        th { background: #FEF3C7; font-weight: 600; color: #92400E; }
        .total-row td { border-top: 2px solid #562D1D; font-weight: bold; font-size: 1.1em; }
        .footer { background: #F8FAFC; padding: 1.5rem; text-align: center; font-size: 0.9rem; color: #6B7280; border-top: 1px solid #E5E7EB; }
        .address-box { background: #F0F9FF; border: 1px solid #0EA5E9; border-radius: 12px; padding: 1.25rem; }
        h1, h2, h3 { margin: 0 0 0.5rem 0; }
        ul { padding-left: 1.5rem; }
      </style>
    </head>
    <body>
      <div class="header">
        <h1 style="margin: 0; font-size: 2rem;">🆕 NEW ORDER</h1>
        <p style="margin: 0.5rem 0 0 0; opacity: 0.9;">Order #${orderId}</p>
      </div>

      <div style="padding: 2rem;">
        <div class="order-card">
          <h2 style="color: #562D1D; margin-bottom: 1rem;">👤 Customer Details</h2>
          <p><strong>Name:</strong> ${contact_name || 'N/A'}</p>
          <p><strong>Email:</strong> ${contact_email || user_email}</p>
          <p><strong>Phone:</strong> ${phone || 'N/A'}</p>
          <p><strong>Payment:</strong> 
            <span class="status placed">${payment_mode || 'UPI'}</span>
          </p>
        </div>

        <div class="order-card">
          <h2 style="color: #562D1D; margin-bottom: 1rem;">📍 Delivery Address</h2>
          <div class="address-box">
            <div style="font-size: 1.1em; font-weight: 600; margin-bottom: 0.5rem;">${contact_name || 'Customer'}</div>
            <div>${address_line1 || 'N/A'}</div>
            ${address_line2 ? `<div>${address_line2}</div>` : ''}
            <div><strong>${city || 'N/A'}, ${pincode ? pincode : ''}</strong></div>
            <div>${state || ''}${country ? `, ${country}` : ', India'}</div>
            ${address ? `<div style="font-style: italic; margin-top: 0.5rem; font-size: 0.95em;">
              Full: ${address}
            </div>` : ''}
          </div>
        </div>

        <div class="order-card">
          <h2 style="color: #562D1D; margin-bottom: 1rem;">🛍️ Order Items</h2>
          <table>
            <thead>
              <tr>
                <th>Product</th>
                <th style="text-align: center;">Qty</th>
                <th style="text-align: right;">Price</th>
                <th style="text-align: right;">Total</th>
              </tr>
            </thead>
            <tbody>
              ${items.map((it, idx) => `
                <tr style="${idx % 2 === 0 ? 'background: #FEFCE8;' : ''}">
                  <td style="font-weight: 500;">${it.name}</td>
                  <td style="text-align: center; font-weight: 600;">${it.qty}</td>
                  <td style="text-align: right;">₹${parseFloat(it.price || 0).toFixed(2)}</td>
                  <td style="text-align: right; font-weight: 600; color: #059669;">₹${(parseFloat(it.price || 0) * parseInt(it.qty || 1)).toFixed(2)}</td>
                </tr>
              `).join('')}
              <tr class="total-row">
                <td colspan="3" style="text-align: right; font-weight: 600; padding-top: 1rem;">GRAND TOTAL</td>
                <td style="text-align: right; color: #B91C1C; font-size: 1.2em;">₹${parseFloat(total || 0).toFixed(2)}</td>
              </tr>
            </tbody>
          </table>
        </div>

        <div class="highlight">
          <h3>⚡ Quick Actions</h3>
          <ul style="margin: 0.5rem 0 0 0; padding-left: 1.5rem;">
            <li>✅ Update status in <strong>Admin Dashboard → Orders</strong></li>
            <li>📦 Prepare for shipping</li>
            <li>📱 Contact customer if needed</li>
          </ul>
        </div>

        <div class="footer">
          <p>This is an automatic notification from Adharv International.</p>
          <p>Manage orders at your admin dashboard.</p>
        </div>
      </div>
    </body>
    </html>
    `
  });
  console.log('✅ Admin notification email sent successfully');
} catch (e) {
  console.error('❌ Error sending admin order email:', e.message);
}


    res.json({ success: true, order_id: orderId });
  } catch (error) {
    console.error('Error creating order:', error);
    res.status(500).json({ error: 'Failed to create order', details: error.message });
  }
};

// Get all orders (admin)
exports.getAllOrders = async (req, res) => {
  try {
    const [orders] = await db.query(`
      SELECT o.*, u.username AS user_name, u.email AS user_email
      FROM orders o
      LEFT JOIN users u ON o.user_id = u.id
      ORDER BY o.created_at DESC
    `);

    for (const order of orders) {
      const [items] = await db.query('SELECT * FROM order_items WHERE order_id = ?', [order.id]);
      order.items = items;
    }
    res.json({ orders });
  } catch (error) {
    console.error('Error getting all orders:', error);
    res.status(500).json({ error: 'Failed to fetch orders', details: error.message });
  }
};

// Update order delivery status (admin)
exports.updateOrderStatus = async (req, res) => {
  try {
    const orderId = req.params.id;
    const { status } = req.body;

    const [result] = await db.query('UPDATE orders SET status = ? WHERE id = ?', [status, orderId]);
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Order not found' });
    }

    // If delivered, send thank‑you email
    if (status === 'Delivered') {
      try {
        const [rows] = await db.query(
          'SELECT contact_name, contact_email, total FROM orders WHERE id = ?',
          [orderId]
        );
        if (rows.length) {
          const o = rows[0];
          await transporter.sendMail({
            from: process.env.EMAIL_USER,
            to: o.contact_email,
            subject: `Your order #${orderId} has been delivered`,
            html: `
              <p>Hi ${o.contact_name || 'there'},</p>
              <p>Your order <strong>#${orderId}</strong> has been delivered successfully.</p>
              <p>Total paid: <strong>₹${o.total}</strong></p>
              <p>Thank you for joining us and we hope to serve you again soon.</p>
              <p>We'd love to hear your feedback! Please rate your experience on your dashboard.</p>
              <p>Warm regards,<br/>Adharv International</p>
            `
          });
        }
      } catch (e) {
        console.error('Error sending delivered email:', e.message);
      }
    }

    res.json({ success: true, message: `Order ${orderId} status updated to ${status}` });
  } catch (error) {
    console.error('Error updating order status:', error);
    res.status(500).json({ error: 'Failed to update order status', details: error.message });
  }
};

// ============= NEW FUNCTIONS =============

// Generate and download invoice
// Generate and download invoice
exports.generateInvoice = async (req, res) => {
  try {
    const orderId = req.params.id;
    
    // Extract user email from JWT token
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      return res.status(401).json({ error: 'No authorization header' });
    }

    const token = authHeader.replace('Bearer ', '');
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your_jwt_secret');
    const userEmail = decoded.email;

    // Fetch order details
    const [orderRows] = await db.query(
      `SELECT o.*, u.username, u.email as user_email
       FROM orders o 
       LEFT JOIN users u ON o.user_id = u.id
       WHERE o.id = ? AND u.email = ?`,
      [orderId, userEmail]
    );

    if (orderRows.length === 0) {
      return res.status(404).json({ error: 'Order not found or unauthorized' });
    }

    const order = orderRows[0];
    
    // Fetch order items
    const [items] = await db.query(
      'SELECT * FROM order_items WHERE order_id = ?',
      [orderId]
    );

    // Create PDF
    const doc = new PDFDocument({ margin: 50 });

    // Set response headers
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename=invoice-${orderId}.pdf`);

    // Pipe the PDF to response
    doc.pipe(res);

    // Add company header
    doc
      .fontSize(24)
      .font('Helvetica-Bold')
      .fillColor('#562D1D')
      .text('ADHARV INTERNATIONAL', { align: 'center' })
      .fontSize(12)
      .fillColor('#666666')
      .font('Helvetica')
      .text('Sacred Brass Creations', { align: 'center' })
      .text('Email: team.zentrixinfotech@gmail.com', { align: 'center' })
      .moveDown(2);

    // Invoice title
    doc
      .fontSize(20)
      .fillColor('#000000')
      .font('Helvetica-Bold')
      .text('TAX INVOICE', { align: 'center' })
      .moveDown(1);

    // Order details box
    doc
      .fontSize(10)
      .font('Helvetica')
      .fillColor('#000000')
      .text(`Invoice Number: INV-${String(orderId).padStart(6, '0')}`)
      .text(`Order ID: #${orderId}`)
      .text(`Date: ${new Date(order.created_at).toLocaleDateString('en-IN', {
        day: '2-digit',
        month: 'long',
        year: 'numeric'
      })}`)
      .text(`Status: ${order.status}`)
      .moveDown(1.5);

    // Customer details
    doc
      .fontSize(12)
      .font('Helvetica-Bold')
      .text('Bill To:')
      .fontSize(10)
      .font('Helvetica')
      .text(order.contact_name || order.username || 'Customer')
      .text(order.contact_email || order.user_email);

    // Add address
    const fullAddress = order.address || 
      [order.address_line1, order.address_line2, 
       `${order.city || ''} - ${order.pincode || ''}`.trim(), 
       order.state, order.country || 'India']
      .filter(Boolean).join(', ');
    
    if (fullAddress) {
      doc.text(fullAddress, { width: 300 });
    }
    
    if (order.phone) {
      doc.text(`Phone: ${order.phone}`);
    }
    
    doc.moveDown(2);

    // Items table header
    const tableTop = doc.y;
    doc
      .fontSize(10)
      .font('Helvetica-Bold')
      .fillColor('#FFFFFF')
      .rect(50, tableTop - 5, 500, 20)
      .fill('#562D1D')
      .fillColor('#FFFFFF')
      .text('Item', 55, tableTop)
      .text('Qty', 320, tableTop, { width: 40, align: 'center' })
      .text('Price', 380, tableTop, { width: 60, align: 'right' })
      .text('Total', 460, tableTop, { width: 80, align: 'right' });

    // Items
    let yPosition = tableTop + 25;
    doc.fillColor('#000000').font('Helvetica');

    items.forEach((item, index) => {
      if (yPosition > 700) {
        doc.addPage();
        yPosition = 50;
      }

      // Convert to numbers - FIX HERE
      const qty = parseInt(item.qty) || 1;
      const price = parseFloat(item.price) || 0;
      const itemTotal = qty * price;

      // Alternate row background
      if (index % 2 === 0) {
        doc.rect(50, yPosition - 5, 500, 25).fill('#FAF5ED');
      }

      doc
        .fillColor('#000000')
        .text(item.name, 55, yPosition, { width: 250 })
        .text(qty.toString(), 320, yPosition, { width: 40, align: 'center' })
        .text(`₹${price.toFixed(2)}`, 380, yPosition, { width: 60, align: 'right' })
        .text(`₹${itemTotal.toFixed(2)}`, 460, yPosition, { width: 80, align: 'right' });

      yPosition += 25;
    });

    // Draw line before total
    doc
      .moveTo(50, yPosition + 5)
      .lineTo(550, yPosition + 5)
      .strokeColor('#562D1D')
      .lineWidth(2)
      .stroke();

    yPosition += 20;

    // Convert total to number - FIX HERE
    const orderTotal = parseFloat(order.total) || 0;

    // Subtotal
    doc
      .fontSize(11)
      .font('Helvetica')
      .fillColor('#000000')
      .text('Subtotal:', 380, yPosition, { width: 80, align: 'right' })
      .text(`₹${orderTotal.toFixed(2)}`, 460, yPosition, { width: 80, align: 'right' });

    yPosition += 20;

    // Total (bold)
    doc
      .fontSize(14)
      .font('Helvetica-Bold')
      .fillColor('#562D1D')
      .text('Grand Total:', 380, yPosition, { width: 80, align: 'right' })
      .text(`₹${orderTotal.toFixed(2)}`, 460, yPosition, { width: 80, align: 'right' });

    // Payment info
    yPosition += 40;
    doc
      .fontSize(10)
      .fillColor('#000000')
      .font('Helvetica')
      .text(`Payment Mode: ${order.payment_mode || 'UPI'}`, 50, yPosition);

    // Footer
    doc
      .moveDown(3)
      .fontSize(10)
      .font('Helvetica-Oblique')
      .fillColor('#666666')
      .text('Thank you for your purchase!', { align: 'center' })
      .text('For any queries, contact us at team.zentrixinfotech@gmail.com', { 
        align: 'center' 
      })
      .moveDown(1)
      .fontSize(8)
      .text('This is a computer-generated invoice and does not require a signature.', {
        align: 'center'
      });

    // Finalize PDF
    doc.end();

  } catch (error) {
    console.error('Error generating invoice:', error);
    // Only send error response if headers haven't been sent
    if (!res.headersSent) {
      res.status(500).json({ error: 'Failed to generate invoice', details: error.message });
    }
  }
};


// Submit product review
exports.submitReview = async (req, res) => {
  try {
    const orderId = req.params.id;
    const { item_id, rating, comment } = req.body;
    
    // Extract user email from JWT token
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      return res.status(401).json({ error: 'No authorization header' });
    }

    const token = authHeader.replace('Bearer ', '');
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your_jwt_secret');
    const userEmail = decoded.email;

    // Validate input
    if (!rating || rating < 1 || rating > 5) {
      return res.status(400).json({ error: 'Rating must be between 1 and 5' });
    }

    // Verify order belongs to user and is delivered
    const [orderRows] = await db.query(
      `SELECT o.* FROM orders o
       LEFT JOIN users u ON o.user_id = u.id
       WHERE o.id = ? AND u.email = ? AND o.status = 'Delivered'`,
      [orderId, userEmail]
    );

    if (orderRows.length === 0) {
      return res.status(404).json({ 
        error: 'Order not found or not yet delivered' 
      });
    }

    // Check if review already exists
    const [existingReview] = await db.query(
      `SELECT * FROM reviews WHERE order_id = ? AND item_id = ? AND user_email = ?`,
      [orderId, item_id, userEmail]
    );

    if (existingReview.length > 0) {
      return res.status(400).json({ error: 'You have already reviewed this item' });
    }

    // Insert review
    await db.query(
      `INSERT INTO reviews (order_id, item_id, user_email, rating, comment, created_at) 
       VALUES (?, ?, ?, ?, ?, NOW())`,
      [orderId, item_id, userEmail, rating, comment || '']
    );

    res.json({ 
      success: true, 
      message: 'Review submitted successfully. Thank you for your feedback!' 
    });

  } catch (error) {
    console.error('Error submitting review:', error);
    res.status(500).json({ error: 'Failed to submit review', details: error.message });
  }
};
