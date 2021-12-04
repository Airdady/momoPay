const bcrypt = require('bcryptjs');
const { userService, walletService } = require('../services');
const User = require('../models/user.model')

const getReceiver = async (req, res, next) => {
  const user = await userService.getUserByPhoneNumber(req.params.phoneNumber);
  if (user) {
    req.user = user;
    return next();
  }
  try {
    const newUser = await userService.createUser({ phoneNumber: req.params.phoneNumber, password: '0000' });
    await walletService.createWallet(newUser);
    req.user = newUser;
    return next();
  } catch (error) {
    return res.send('failed');
  }
};

exports.checkRegistration = async (req, res) => {
  const user = await userService.getUserByPhoneNumber(req.params.phoneNumber);
  const userMatch = user && (await bcrypt.compare('0000', user.password));
  if (!user || userMatch) {
    return res.status(200).send({ registered: false });
  }
  return res.status(200).send({ registered: true });
};

module.exports.getReceiver = getReceiver;
