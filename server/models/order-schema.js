import mongoose from 'mongoose';
import Customer from './customer-schema.js';

const orderSchema = new mongoose.Schema({
  customerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Customer',
    required: true,
  },
  orderTotalAmount: {
    type: Number,
    required: true,
  },
  orderDateStamp: {
    type: Date,
    default: Date.now,
  },
});


const Order = mongoose.model('Order', orderSchema);

export default Order;
