const express = require('express');
const router = express.Router();
const { 
  getUserOrders, 
  getAllOrders, 
  updateOrderStatus, 
  createOrder,
  generateInvoice,
  submitReview
} = require('../controllers/ordersController');

// Get current user's orders (user dashboard)
router.get('/my', getUserOrders);

// Get all orders (admin)
router.get('/', getAllOrders);

// Create new order (when user places order at checkout)
router.post('/', createOrder);

// Update order delivery status (admin panel)
router.put('/:id/status', updateOrderStatus);

// ============= NEW ROUTES =============

// Download invoice (protected - user must own the order)
router.get('/:id/invoice', generateInvoice);

// Submit review (protected - user must own the order and it must be delivered)
router.post('/:id/review', submitReview);

module.exports = router;
