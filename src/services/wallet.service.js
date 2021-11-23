const Wallet = require('../models/wallet.model');

const creditWallet = async (transaction, user) => {
  const wallet = await Wallet.findOne({ user: user.id });
  wallet.balance += transaction.amount;
  wallet.save();
  return wallet;
};

const createWallet = async (user) => {
  const wallet = new Wallet();
  wallet.user = user;
  wallet.save();
};

const debitWallet = async (transaction, user) => {
  const wallet = await Wallet.findOne({ user: user.id });
  wallet.balance -= transaction.amount;
  wallet.save();
  return wallet;
};

const viewWallet = async (user) => {
  const wallet = await Wallet.findOne({ user: user.id });
  return wallet;
};

module.exports = {
  creditWallet,
  createWallet,
  debitWallet,
  viewWallet,
};
