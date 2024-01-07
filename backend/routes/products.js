const express = require('express');
const router = express.Router();
const Product = require('../models/Product');
const authMiddleware = require('../middleware/authMiddleware');

router.get('/', async (req, res) => {
  try {
    const products = await Product.find();
    res.json(products);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
router.get('/:id', async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    res.json(product);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
router.get('/byCategory/:category', async (req, res) => {
  const category = req.params.category;

  try {
    const productsByCategory = await Product.find({ category });
    res.json(productsByCategory);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});


//add new product 

router.post('/', authMiddleware, async (req, res) => {
  // Check if the user has the required role (e.g., "admin")
  if (req.user.role !== 'admin') {
    console.log(req.user);
    return res.status(403).json({ message: 'Permission denied. Admin access required.' });
  }

  const { name, description, price, category } = req.body;

  try {
    const newProduct = new Product({
      name,
      description,
      price,
      category,
    });

    const savedProduct = await newProduct.save();
    res.status(201).json(savedProduct);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Update a product by ID (admin only)
router.put('/:id', authMiddleware, async (req, res) => {
  // Check if the user has the required role (e.g., "admin")
  if (req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Permission denied. Admin access required.' });
  }

  const { name, description, price, category } = req.body;

  try {
    const updatedProduct = await Product.findByIdAndUpdate(
      req.params.id,
      {
        name,
        description,
        price,
        category,
      },
      { new: true }
    );

    if (!updatedProduct) {
      return res.status(404).json({ message: 'Product not found' });
    }

    res.json(updatedProduct);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Delete a product by ID (admin only)
router.delete('/:id', authMiddleware, async (req, res) => {
  // Check if the user has the required role (e.g., "admin")
  if (req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Permission denied. Admin access required.' });
  }

  try {
    const deletedProduct = await Product.findByIdAndDelete(req.params.id);

    if (!deletedProduct) {
      return res.status(404).json({ message: 'Product not found' });
    }

    res.json({ message: 'Product deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});


module.exports = router;
