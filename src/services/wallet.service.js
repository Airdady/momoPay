const Wallet = require('../models/wallet.model');
const transactionService = require('./transaction.service');

const debitWallet = async (data, user, transactionId) => {
  const wallet = await Wallet.findOne({ user: data.sender });
  const balanceBefore = wallet.balance;
  wallet.balance -= data.amount && parseInt(data.amount, 10);
  wallet.save();
  const balanceAfter = wallet.balance;
  const userTransaction = {
    amount: data.amount,
    balanceBefore,
    balanceAfter,
    status: 'COMPLETE',
    fees: 0,
    type: 'SENT',
    sender: { phoneNumber: data.sender.phoneNumber, name: data.sender.name },
    receiver: { phoneNumber: user.phoneNumber, name: user.name },
    reference: transactionId,
  };
  const transaction = await transactionService.createTransaction(userTransaction, data.sender);
  return { wallet, transaction };
};

const creditWallet = async (data, user, transactionId) => {
  const wallet = await Wallet.findOne({ user });
  const balanceBefore = wallet.balance;
  wallet.balance += data.amount && parseInt(data.amount, 10);
  wallet.save();
  const balanceAfter = wallet.balance;
  const userTransaction = {
    amount: data.amount,
    balanceBefore,
    balanceAfter,
    status: 'COMPLETE',
    fees: 0,
    type: 'RECEIVED',
    sender: { phoneNumber: data.sender.phoneNumber, name: data.sender.name },
    receiver: { phoneNumber: user.phoneNumber, name: user.name },
    reference: transactionId,
  };
  const transaction = await transactionService.createTransaction(userTransaction, user);
  return { wallet, transaction };
};

const sendMoney = async (data, receiver) => {
  const transactionId = Math.random().toString().slice(4, 14);
  await creditWallet(data, receiver, transactionId);
  await debitWallet(data, receiver, transactionId);
  return { success: true, transactionId, receiver };
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
