const httpStatus = require('http-status');
const catchAsync = require('../utils/catchAsync');
const walletService = require('../services/wallet.service');

const sendMoney = catchAsync(async (req, res) => {
  const wallet = await walletService.sendMoney(req.body, req.receiver);
  res.status(httpStatus.CREATED).send({ status: httpStatus.CREATED, data: wallet });
});

const viewWallet = catchAsync(async (req, res) => {
  const wallet = await walletService.viewWallet(req.user);
  res.send(wallet);
});

const debitWallet = catchAsync(async (req, res) => {
  const wallet = await walletService.debitWallet(req.body, req.user);
  res.send(wallet);
});

const sendCredit = catchAsync(async (req, res) => {
  const sent = await walletService.debitWallet(req.body, req.user);
  await walletService.creditWallet(req.body, req.receiver);
  res.send({ sent });
});

module.exports = {
  sendMoney,
  viewWallet,
  debitWallet,
  sendCredit,
};
