import mongoose from 'mongoose';

const audienceSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  description: {
    type: String,
  },
  criteria: {
    minTotalSpend: {
      type: Number,
      required: true,
    },
    minTotalVisits: {
      type: Number,
      required: true,
    },
    lastMonthsNotVisited: {
      type: Number,
      required: true,
    },
    operator1: {
      type: String,
      enum: ['AND', 'OR'],
      required: true,
    },
    operator2: {
      type: String,
      enum: ['AND', 'OR'],
      required: true,
    },
  },
  customers: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Customer',
  }],
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Audience = mongoose.model('Audience', audienceSchema);

export default Audience;
