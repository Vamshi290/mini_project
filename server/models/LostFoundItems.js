const mongoose = require('mongoose');

const lostFoundItemSchema = new mongoose.Schema({
  name: String,
  category: String,
  description: String,
  location: String,
  date: { type: Date, default: Date.now },
  status: { type: String, default: 'pending' }, // 'pending', 'approved', 'rejected'
  itemType: { type: String, enum: ['lost', 'found'] }, // 'lost' or 'found'
  image: String,
});

const LostFoundItem = mongoose.model('LostFoundItem', lostFoundItemSchema);

module.exports = LostFoundItem;
