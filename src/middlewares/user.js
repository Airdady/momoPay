const { userService } = require('../services');

const getReceiver = async (req, res, next) => {
  const user = await userService.getUserByEmail(req.params.email);
  if (user) {
    req.user = user;
    return next();
  }
  res.send('Receiver not found');
};

module.exports.getReceiver = getReceiver;
