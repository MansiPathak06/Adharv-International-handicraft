const express = require('express');
const cors = require('cors');
require('dotenv').config();
const path = require('path');


const authRoutes = require('./routes/authRoutes');
const productRoutes = require('./routes/productsRoutes');
const ordersRoutes = require('./routes/ordersRoutes'); 

const app = express();
// ✅ IMPORTANT: Serve uploads folder as static files
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use(cors());
app.use(express.json());
app.use('/api', authRoutes);
app.use('/uploads', express.static('uploads'));
app.use('/api/products', productRoutes);
app.use('/api/orders', ordersRoutes);

app.listen(5000, () => console.log('Server running on port 5000'));
