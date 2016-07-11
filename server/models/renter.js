import mongoose from 'mongoose';
const Schema = mongoose.Schema;

const schema = new Schema({
  name: { type: String, required: true },
  money: { type: Number, default: 0 },
  apartment: { type: mongoose.Schema.ObjectId, ref: 'Apartment', default: null },
});

module.exports = mongoose.model('Renter', schema);
