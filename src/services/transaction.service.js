const Transaction = require('../models/transaction.model');

const createTransaction = async (body, user) => {
  const wallet = new Transaction(body);
  wallet.user = user;
  wallet.save();
  return wallet;
};

const updateTransaction = async (transaction, user) => {
  const wallet = await Transaction.findOne({ user: user.id });
  wallet.balance -= transaction.amount;
  wallet.save();
  return wallet;
};

// const viewTransactions = async (user) => {
//   const wallet = await Transaction.find({ user: user.id });
//   return wallet;
// };

const viewTransactions = async (filter, options) => {
  const wallet = await Transaction.paginate(filter, options);
  return wallet;
};

const viewTransaction = async (user, id) => {
  const wallet = await Transaction.findOne({ user: user.id, id });
  return wallet;
};

module.exports = {
  updateTransaction,
  createTransaction,
  viewTransactions,
  viewTransaction,
};
