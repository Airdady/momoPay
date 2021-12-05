const httpStatus = require('http-status');
const catchAsync = require('../utils/catchAsync');
const { authService, userService, tokenService, smsService, walletService } = require('../services');

const register = catchAsync(async (req, res) => {
  const user = await userService.createUser(req.body);
  const tokens = await tokenService.generateAuthTokens(user);
  await walletService.createWallet(user);
  const sms = await smsService.generateOtp(req.body.phoneNumber);
  res.status(httpStatus.CREATED).send({ user, tokens, sms });
});

const login = catchAsync(async (req, res) => {
  const { phoneNumber, password } = req.body;
  const user = await authService.loginUserWithPhoneAndPassword(phoneNumber, password);
  const tokens = await tokenService.generateAuthTokens(user);
  res.send({ user, tokens });
});

const logout = catchAsync(async (req, res) => {
  await authService.logout(req.body.refreshToken);
  res.status(httpStatus.NO_CONTENT).send();
});

const refreshTokens = catchAsync(async (req, res) => {
  const tokens = await authService.refreshAuth(req.body.refreshToken);
  res.send({ ...tokens });
});

const forgotPassword = catchAsync(async (req, res) => {
  const resetPasswordToken = await tokenService.generateResetPasswordToken(req.body.email);
  await smsService.sendResetPasswordEmail(req.body.email, resetPasswordToken);
  res.status(httpStatus.NO_CONTENT).send();
});

const resetPassword = catchAsync(async (req, res) => {
  await authService.resetPassword(req.query.token, req.body.password);
  res.status(httpStatus.NO_CONTENT).send();
});

const sendVerification = catchAsync(async (req, res) => {
  await smsService.generateOtp(req.user.phoneNumber);
  res.status(httpStatus.NO_CONTENT).send();
});

const verifyPhoneNumber = catchAsync(async (req, res) => {
  const sms = await smsService.verifyCode(req.params.phoneNumber, req.params.code);
  if (sms.data.status === 200) {
    await userService.verifyUser(req.params.phoneNumber);
    return res.send({ status: 200, message: 'verification successful' });
  }
  return res.send({ status: 400, message: 'verification failed' });
});

module.exports = {
  register,
  login,
  logout,
  refreshTokens,
  forgotPassword,
  resetPassword,
  sendVerification,
  verifyPhoneNumber,
};
