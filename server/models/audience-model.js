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
      required: false,
    },
    minTotalVisits: {
      type: Number,
      required: false,
    },
    lastMonthsNotVisited: {
      type: Number,
      required: false,
    },
    operator1: {
      type: String,
      enum: ['AND', 'OR'],
      required: false,
    },
    operator2: {
      type: String,
      enum: ['AND', 'OR'],
      required: false,
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
