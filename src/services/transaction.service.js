const Transaction = require('../models/transaction.model');
const User = require('../models/user.model');
//const User = require('../models/user.model');

const createTransaction = async (body, user) => {
  const transaction = new Transaction(body);
  transaction.user = user;
  transaction.save();
  return transaction;
};

const updateTransaction = async (data, user) => {
  const transaction = await Transaction.findOne({ user: user.id });
  transaction.status = data.status;
  transaction.save();
  return transaction;
};

const viewTransactions = async (filter, options) => {
  const transaction = await Transaction.paginate(filter, options);
  return transaction;
};

const viewTransaction = async (id) => {
  const transaction = await Transaction.findById(id);
  return transaction;
};

const viewTransactionsByUser = async (user) => {
  const transactions = await Transaction.find({ user: user });

  return transactions;
};

module.exports = {
  updateTransaction,
  createTransaction,
  viewTransactions,
  viewTransaction,
  viewTransactionsByUser,
};
