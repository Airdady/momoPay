const { userService, walletService, smsService } = require('../services');

const getReceiver = async (req, res, next) => {
  const user = await userService.getUserByPhoneNumber(req.params.phoneNumber);
  if (user) {
    req.receiver = user;
    req.body.sender = req.user;
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
  if (!user || !user.verified) {
    const response = await smsService.generateOtp(req.params.phoneNumber);
    console.log(response.data);
    return res.status(200).send({ phoneNumber: req.params.phoneNumber, verified: false });
  }
  const { verified, phoneNumber } = user;
  return res.status(200).send({ verified, phoneNumber });
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
