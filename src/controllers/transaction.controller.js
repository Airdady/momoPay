const httpStatus = require('http-status');
const catchAsync = require('../utils/catchAsync');
const transactionService = require('../services/transaction.service');
const pick = require('../utils/pick');

const createTransaction = catchAsync(async (req, res) => {
  const wallet = await transactionService.createTransaction(req.body, req.user);
  res.status(httpStatus.CREATED).send({ status: httpStatus.CREATED, data: wallet });
});

const updateTransaction = catchAsync(async (req, res) => {
  const wallet = await transactionService.updateTransaction(req.body, req.user);
  res.send({ data: wallet });
});

const viewTransactions = catchAsync(async (req, res) => {
  const filter = pick(req.query, ['name', 'role']);
  const options = pick(req.query, ['sortBy', 'limit', 'page']);
  const result = await transactionService.viewTransactions(filter, options);
  res.send({ status: 200, data: result });
});

const viewTransaction = catchAsync(async (req, res) => {
  const wallet = await transactionService.viewTransaction(req.params.id);
  res.send(wallet);
});

module.exports = {
  createTransaction,
  updateTransaction,
  viewTransactions,
  viewTransaction,
};
