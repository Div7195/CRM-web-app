import mongoose from 'mongoose';

const deliveryReceiptSchema = new mongoose.Schema({
  campaignId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Campaign',
    required: true
  },
  customerReceipts: [{
    customerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Customer',
      required: true
    },
    status: {
      type: String,
      enum: ['SENT', 'FAILED'],
      required: true
    }
  }]
});

const DeliveryReceipt = mongoose.model('DeliveryReceipt', deliveryReceiptSchema);

export default DeliveryReceipt;
