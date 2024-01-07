// routes/orders.js
const express = require('express');
const router = express.Router();
const Order = require('../models/Order');
const authMiddleware = require('../middleware/authMiddleware');

// Get all orders (admin only)
router.get('/', authMiddleware, async (req, res) => {
    try {
        // Check if the user has admin role
        if (req.user.role !== 'admin') {
            return res.status(403).json({ message: 'Permission denied. Admin access required.' });
        }

        const orders = await Order.find();
        res.json(orders);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Get a single order by ID
router.get('/:id', authMiddleware, async (req, res) => {
    try {
        const order = await Order.findById(req.params.id);

        // Check if the order exists
        if (!order) {
            return res.status(404).json({ message: 'Order not found' });
        }

        // Check if the user has the right to access the order
        if (req.user._id.toString() !== order.user.toString() && req.user.role !== 'admin') {
            return res.status(403).json({ message: 'Permission denied. You do not have access to this order.' });
        }

        res.json(order);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Place a new order (authenticated user only)
router.post('/', authMiddleware, async (req, res) => {
    const { products, totalAmount } = req.body;

    try {
        const newOrder = new Order({
            user: req.user._id, // The ID of the authenticated user
            products,
            totalAmount,
            status: 'pending', // Initial status of the order
        });

        const savedOrder = await newOrder.save();
        res.status(201).json(savedOrder);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// Update the status of an order (admin only)
router.put('/:id/status', authMiddleware, async (req, res) => {
    const { status } = req.body;

    try {
        // Check if the user has admin role
        if (req.user.role !== 'admin') {
            return res.status(403).json({ message: 'Permission denied. Admin access required.' });
        }

        const updatedOrder = await Order.findByIdAndUpdate(
            req.params.id,
            { status },
            { new: true } // Return the updated order
        );

        // Check if the order exists
        if (!updatedOrder) {
            return res.status(404).json({ message: 'Order not found' });
        }

        res.json(updatedOrder);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// Cancel an order (authenticated user only)
router.delete('/:id', authMiddleware, async (req, res) => {
    try {
        const order = await Order.findById(req.params.id);

        // Check if the order exists
        if (!order) {
            return res.status(404).json({ message: 'Order not found' });
        }

        // Check if the user has the right to cancel the order
        if (req.user._id.toString() !== order.user.toString() && req.user.role !== 'admin') {
            return res.status(403).json({ message: 'Permission denied. You do not have the right to cancel this order.' });
        }

        // Check if the order is in a cancellable state (e.g., not already cancelled)
        if (order.status === 'cancelled') {
            return res.status(400).json({ message: 'This order has already been cancelled' });
        }

        // Update the order status to "cancelled"
        order.status = 'cancelled';
        await order.save();

        res.json({ message: 'Order cancelled successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;
