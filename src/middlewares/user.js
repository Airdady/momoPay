const { userService } = require('../services');

const getReceiver = async (req, res, next) => {
  const user = await userService.getUserByPhoneNumber(req.params.phoneNumber);
  if (!user) {
    req.phoneNumber = user;
    return next();
  }
  res.send('Phone number is not in Our system');
};

module.exports.getReceiver = getReceiver;
