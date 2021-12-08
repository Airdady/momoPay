const Transaction = require('../models/transaction.model');
const Wallet = require('../models/wallet.model');
const bcrypt = require('bcryptjs');
const { userService, walletService, smsService } = require('../services');
const User = require('../models/user.model');

const getReceiver = async (req, res, next) => {
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

exports.accountBalance = async (req, res, next) => {
  const { amount } = req.body;
  const wallet = await Wallet.findOne({ user: req.user });
  if (wallet.balance < amount) {
    return res.send({ status: 404, messege: 'insufficient account' });
  }
  return next();
};

exports.checkRegistration = async (req, res) => {
  const user = await userService.getUserByPhoneNumber(req.params.phoneNumber);
  if (!user || (user && !user.verified)) {
    const response = await smsService.generateOtp(req.params.phoneNumber);
    console.log(response.data);
    return res.status(200).send({ phoneNumber: req.params.phoneNumber, verified: false });
  }
  const { verified, phoneNumber } = user;
  return res.status(200).send({ verified, phoneNumber });
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

exports.updatePin = async (req, res) => {
  const newPassword = req.body.password;
  const user = await userService.getUserByPhoneNumber(req.params.phoneNumber);
  console.log(req.params);
  if (user) {
    user.password = newPassword;
    await user.save();
    return res.status(200).send(user);
  }
};

exports.checkDefaultPassword = (req, res, next) => {
  if (req.body.password === '0000') {
    return res.status(401).send({
      status: 401,
      message: 'Please register and PIN shouldnot be 0000',
    });
  }
  return next();
};

module.exports.getReceiver = getReceiver;
