const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  libelle: { type: String, required: true }, // Product name
  prix: { type: Number, required: true },    // Price
  image: { type: String }                    // Image URL (optional)
});

module.exports = mongoose.model('Product', productSchema);