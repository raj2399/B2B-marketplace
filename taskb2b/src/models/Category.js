const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true
  },
  slug: {
    type: String,
    required: true,
    unique: true
  },
  attributeSchema: [{
    name: String,
    type: {
      type: String,
      enum: ['string', 'number', 'boolean'],
      default: 'string'
    },
    required: Boolean,
    options: [String] // For predefined values if any
  }]
}, {
  timestamps: true
});

module.exports = mongoose.model('Category', categorySchema); 