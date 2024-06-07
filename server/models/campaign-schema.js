import mongoose from 'mongoose';

const campaignSchema = new mongoose.Schema({
  audienceId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Audience',
    required: true
  },
  subject: {
    type: String,
    required: true
  },
  messageBody: {
    type: String,
    required: true
  },
  date: {
    type: Date,
    default: Date.now
  }
});

const Campaign = mongoose.model('Campaign', campaignSchema);

export default Campaign;
