
const express = require('express');
const mongoose = require('mongoose');
// const bodyParser = require('body-parser');
const Product = require('./src/model/index');
const app = express();
const PORT = process.env.PORT || 5000;
const cors = require("cors");
// Middleware
app.use(express.json());
app.use(cors());
// Database connection
mongoose.connect('mongodb://127.0.0.1:27017/buy_product')
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.log(err));

// Routes
// app.use('/api/products', require('./src/routes/product'));
app.post('/api', async (req, res) => {
    const product = new Product({
      name: req.body.name,
      price: req.body.price,
      description: req.body.description
    });
  
    try {
      const newProduct = await product.save();
      res.status(201).json(newProduct);
    } catch (err) {
      res.status(400).json({ message: err.message });
    }
  });

  app.get('/api', async (req, res) => {
    try {
      const products = await Product.find();
      res.json(products);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  });

  app.delete('/', getProduct, async (req, res) => {
    try {
      await res.product.remove();
      res.json({ message: 'Product deleted' });
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  });

  async function getProduct(req, res, next) {
    try {
      const product = await Product.findById(req.params.id);
      if (!product) {
        return res.status(404).json({ message: 'Cannot find product' });
      }
      res.product = product;
      next();
    } catch (err) {
      return res.status(500).json({ message: err.message });
    }
  }

  // Update a product
app.patch("/", getProduct, async (req, res) => {
    if (req.body.name != null) {
      res.product.name = req.body.name;
    }
    if (req.body.price != null) {
      res.product.price = req.body.price;
    }
    if (req.body.description != null) {
      res.product.description = req.body.description;
    }
    try {
      const updatedProduct = await res.product.save();
      res.json(updatedProduct);
    } catch (err) {
      res.status(400).json({ message: err.message });
    }
  });
  
// Start server
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));




