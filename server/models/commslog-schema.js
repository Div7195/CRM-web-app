import mongoose from 'mongoose';

const commsLogs = new mongoose.Schema({
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

const CommsLogs = mongoose.model('CommsLog', commsLogs);

export default CommsLogs;
