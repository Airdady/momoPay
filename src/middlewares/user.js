const Wallet = require('../models/wallet.model');
const bcrypt = require('bcryptjs');
const { userService, walletService, smsService } = require('../services');

exports.getReceiver = async (req, res, next) => {
  const user = await userService.getUserByPhoneNumber(req.params.phoneNumber);
  req.body.sender = req.user;
  if (user) {
    req.receiver = user;
    return next();
  }
  try {
    const newUser = await userService.createUser({ phoneNumber: req.params.phoneNumber, password: '0000' });
    await walletService.createWallet(newUser);
    req.receiver = newUser;
    return next();
  } catch (error) {
    return res.send('failed');
  }
};

exports.checkDuplicateSend = async (req, res, next) => {
  if (req.body.sender.phoneNumber === req.receiver.phoneNumber) {
    return res.status(400).send({ status: 400, message: 'transaction fobbiden' });
  }
  return next();
};

exports.accountBalance = async (req, res, next) => {
  const { amount } = req.body;
  const wallet = await Wallet.findOne({ user: req.user });
  if (wallet.balance < amount) {
    return res.send({ status: 404, messege: 'insufficient account' });
  }
  return next();
};
exports.checkIfUserAreadyExist = async (req, res, next) => {
  const user = await userService.getUserByPhoneNumber(req.body.phoneNumber);
  if (user) {
    return res.status(409).send({ status: 409, message: 'This phoneNumber is Already Taken' });
  }
  return next();
};

exports.checkAmountLimit = async (req, res, next) => {
  if (req.body.amount > 2000000) {
    return res.status(400).send({ status: 400, message: 'credit limit exceeded maximum is 7M' });
  }
  return next();
};

exports.checkRegistration = async (req, res) => {
  const user = await userService.getUserByPhoneNumber(req.params.phoneNumber);
  const response = await smsService.generateOtp(req.params.phoneNumber);
  if (!user || (user && !user.verified)) {
    return res.status(200).send({ phoneNumber: req.params.phoneNumber, verified: false, code: response.data.data.code });
  }
  const { verified, phoneNumber } = user;
  return res.status(200).send({ verified, phoneNumber, code: response.data.data.code });
};

exports.sendResetPin = async (req, res) => {
  const user = await userService.getUserByPhoneNumber(req.params.phoneNumber);
  if (user) {
    const response = await smsService.generateOtp(req.params.phoneNumber);
    console.log(response.data);
    return res.status(200).send({ message: 'Please enter the code to reset your PIN' });
  }
  const { verified, phoneNumber } = user;
  return res.status(200).send({ verified, phoneNumber });
};

exports.checkDefaultPassword = (req, res, next) => {
  if (req.body.password === '0000') {
    return res.status(401).send({
      status: 401,
      message: 'Please register and PIN should not be 0000',
    });
  }
  return next();
};
