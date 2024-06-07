import mongoose from 'mongoose';

const customerSchema = new mongoose.Schema({
  customerName: {
    type: String,
    required: true,
  },
  customerEmail: {
    type: String,
    required: true,
    unique: true,
  },
  customerTotalSpend: {
    type: Number,
    default: 0,
  },
  customerTotalVisits: {
    type: Number,
    default: 0,
  },
  lastVisitDate: {
    type: Date,
    default: Date.now,
  },
});

const Customer = mongoose.model('Customer', customerSchema);

export default Customer;
