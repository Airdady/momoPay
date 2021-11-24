const { userService } = require('../services');

const getReceiver = async (req, res, next) => {
  const user = await userService.getUserByEmail(req.body.receiver);
  if (user) {
    req.receiver = user;
    return next();
  }
  res.send('receiver not found');
};

module.exports.getReceiver = getReceiver;
