const httpStatus = require('http-status');
const catchAsync = require('../utils/catchAsync');
const { walletService } = require('../services');

const creditWallet = catchAsync(async (req, res) => {
  const wallet = await walletService.creditWallet(req.body, req.user);
  res.status(httpStatus.CREATED).send(wallet);
});

const viewWallet = catchAsync(async (req, res) => {
  const wallet = await walletService.viewWallet(req.user);
  res.send(wallet);
});

const debitWallet = catchAsync(async (req, res) => {
  const wallet = await walletService.debitWallet(req.body, req.user);
  res.send(wallet);
});

module.exports = {
  creditWallet,
  viewWallet,
  debitWallet,
};
