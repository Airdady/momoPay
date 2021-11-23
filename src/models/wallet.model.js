const mongoose = require('mongoose');
const { toJSON } = require('./plugins');

const walletSchema = mongoose.Schema(
  {
    airtime: {
      type: Number,
      required: true,
      default: 0,
    },
    dataBundle: {
      type: Number,
      required: true,
      default: 0,
    },
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  },
  {
    timestamps: true,
  }
);

walletSchema.plugin(toJSON);

const Wallet = mongoose.model('Wallet', walletSchema);

module.exports = Wallet;
