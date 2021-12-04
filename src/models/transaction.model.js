const mongoose = require('mongoose');
const { toJSON, paginate } = require('./plugins');

const transactionSchema = mongoose.Schema(
  {
    amount: {
      type: Number,
      required: true,
      default: 0,
    },
    balanceBefore: {
      type: Number,
      required: true,
    },
    balanceAfter: {
      type: Number,
      required: true,
    },
    status: {
      type: String,
      enum: ['PENDING', 'COMPLETE', 'FAILED'],
      default: 'PENDING',
      required: true,
    },
    fees: {
      type: Number,
      required: true,
    },
    type: {
      type: String,
      required: true,
    },
    reference: {
      type: String,
      required: true,
    },
    sender: { type: Object, required: true },
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  },
  {
    timestamps: true,
  }
);

transactionSchema.plugin(toJSON);
transactionSchema.plugin(paginate);

const Transaction = mongoose.model('Transaction', transactionSchema);

module.exports = Transaction;
