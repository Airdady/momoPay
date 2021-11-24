const Transaction = require('../models/transaction.model');

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

const viewTransaction = async (user, id) => {
  const transaction = await Transaction.findOne({ user: user.id, id });
  return transaction;
};

module.exports = {
  updateTransaction,
  createTransaction,
  viewTransactions,
  viewTransaction,
};
