const express = require('express');
const router = express.Router();
const Product = require('../models/Product');
const Order = require('../models/Order');
const jwt = require('jsonwebtoken');

// Middleware to verify JWT token
const authenticateToken = (req, res, next) => {
  const token = req.headers['authorization']?.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'Access denied' });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = decoded.userId;
    req.userRole = decoded.role;
    next();
  } catch (error) {
    res.status(403).json({ error: 'Invalid token' });
  }
};

// Middleware to check if user is admin
const isAdmin = (req, res, next) => {
  if (req.userRole !== 'admin') {
    return res.status(403).json({ error: 'Admin access required' });
  }
  next();
};

// Get all products
router.get('/', async (req, res) => {
  try {
    const products = await Product.find();
    res.json(products);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Create an order (for logged-in users)
router.post('/order', authenticateToken, async (req, res) => {
  try {
    const { products } = req.body;
    // Validate the products array
    if (!products || products.length === 0) {
      return res.status(400).json({ error: 'No products selected' });
    }

    // Validate product IDs exist in the database
    const productIds = products.map(item => item.productId);
    const existingProducts = await Product.find({ _id: { $in: productIds } });
    if (existingProducts.length !== productIds.length) {
      return res.status(400).json({ error: 'One or more products not found' });
    }

    const order = new Order({
      client: req.userId,
      products: products.map(item => ({
        product: item.productId,
        quantity: item.quantity
      }))
    });
    await order.save();
    res.status(201).json({ message: 'Order placed successfully' });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Get all orders (for admin only)
// router.get('/orders', authenticateToken, isAdmin, async (req, res) => {
//   try {
//     const orders = await Order.find()
//       .populate('client', 'nom prenom email')
//       .populate('products.product', 'libelle prix image');
//     res.json(orders);
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// });

router.get('/orders', authenticateToken, isAdmin, async (req, res) => {
  try {
    const orders = await Order.find()
      .populate('client', 'nom prenom email')
      .populate('products.product', 'libelle prix image');
    res.json(orders);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;