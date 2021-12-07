const Wallet = require('../models/wallet.model');
const transactionService = require('./transaction.service');

const debitWallet = async (data, user) => {
  const wallet = await Wallet.findOne({ user: data.sender });
  const balanceBefore = wallet.balance;
  wallet.balance -= data.amount;
  wallet.save();
  const balanceAfter = wallet.balance;
  const userTransaction = {
    amount: data.amount,
    balanceBefore,
    balanceAfter,
    status: 'COMPLETE',
    fees: 0,
    type: 'debit',
    sender: { phoneNumber: data.sender.phoneNumber },
    receiver: { phoneNumber: user.phoneNumber },
    reference: Math.random().toString().slice(4, 14),
  };
  const transaction = await transactionService.createTransaction(userTransaction, data.sender);
  return { wallet, transaction };
};

const creditWallet = async (data, user) => {
  const wallet = await Wallet.findOne({ user });
  const balanceBefore = wallet.balance;
  wallet.balance += data.amount;
  wallet.save();
  const balanceAfter = wallet.balance;
  const userTransaction = {
    amount: data.amount,
    balanceBefore,
    balanceAfter,
    status: 'COMPLETE',
    fees: 0,
    type: 'credit',
    sender: { phoneNumber: data.sender.phoneNumber },
    receiver: { phoneNumber: user.phoneNumber },
    reference: Math.random().toString().slice(4, 14),
  };
  const transaction = await transactionService.createTransaction(userTransaction, user);
  return { wallet, transaction };
};

const sendMoney = async (data, receiver) => {
  await creditWallet(data, receiver);
  await debitWallet(data, receiver);
  return { success: true };
};

const createWallet = async (user) => {
  const wallet = new Wallet();
  wallet.user = user;
  await wallet.save();
  return wallet;
};

const viewWallet = async (user) => {
  const wallet = await Wallet.findOne({ user: user.id });
  return wallet;
};

module.exports = {
  sendMoney,
  createWallet,
  debitWallet,
  viewWallet,
  creditWallet,
};
