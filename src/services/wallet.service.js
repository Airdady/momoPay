const Wallet = require('../models/wallet.model');
const transactionService = require('./transaction.service');

const creditWallet = async (data, user) => {
  const wallet = await Wallet.findOne({ user: user.id });
  const balanceBefore = wallet.balance;
  wallet.balance += data.amount;
  wallet.save();
  const balanceAfter = wallet.balance;
  const userTransaction = {
    name: 'cash deposit',
    amount: data.amount,
    balanceBefore,
    balanceAfter,
    status: 'COMPLETE',
    fees: 0,
    paymentType: 'credit share',
    type: 'deposit',
    reference: Math.random().toString().slice(4, 14),
  };
  const transaction = await transactionService.createTransaction(userTransaction, user);
  return {
    wallet,
    transaction,
  };
};

const createWallet = async (user) => {
  const wallet = new Wallet();
  wallet.user = user;
  wallet.save();
};

const debitWallet = async (data, user) => {
  const wallet = await Wallet.findOne({ user: user.id });
  const balanceBefore = wallet.balance;
  wallet.balance -= data.amount;
  wallet.save();
  const balanceAfter = wallet.balance;
  const userTransaction = {
    name: 'cash withdraw',
    amount: data.amount,
    balanceBefore,
    balanceAfter,
    status: 'COMPLETE',
    fees: 0,
    paymentType: 'debit wallet',
    type: 'withdraw',
    reference: Math.random().toString().slice(4, 14),
  };
  const transaction = await transactionService.createTransaction(userTransaction, user);
  return { wallet, transaction };
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
