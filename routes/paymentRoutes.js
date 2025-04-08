const express = require('express');
const { createOrder } = require('../controllers/paymentController');
const router = express.Router();

router.get('/create-order', (req, res) => res.send("creating order"));
router.get('/success', (req, res) => res.send("success"));
router.get('/webhook', (req, res) => res.send("webhook"));

module.exports = router;
