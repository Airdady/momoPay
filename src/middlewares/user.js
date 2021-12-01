const { userService, walletService } = require('../services');

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

module.exports.getReceiver = getReceiver;
