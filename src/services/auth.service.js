const httpStatus = require('http-status');
const tokenService = require('./token.service');
const userService = require('./user.service');
const Token = require('../models/token.model');
const ApiError = require('../utils/ApiError');
const { tokenTypes } = require('../config/tokens');

/**
 * Login with username and password
 * @param {string} phoneNumber
 * @param {string} password
 * @returns {Promise<User>}
 */
const loginUserWithPhoneAndPassword = async (phoneNumber, password) => {
  const user = await userService.getUserByPhoneNumber(phoneNumber);

  if (!user || !(await user.isPasswordMatch(password))) {
    throw new ApiError(httpStatus.UNAUTHORIZED, 'Incorrect PhoneNumber or password');
  } else if (!user.verified) {
    throw new ApiError(httpStatus.UNAUTHORIZED, 'Please verify your phoneNumber');
  }

  return user;
};

/**
 * Logout
 * @param {string} refreshToken
 * @returns {Promise}
 */
const logout = async (refreshToken) => {
  const refreshTokenDoc = await Token.findOne({ token: refreshToken, type: tokenTypes.REFRESH, blacklisted: false });
  if (!refreshTokenDoc) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Not found');
  }
  await refreshTokenDoc.remove();
};

/**
 * Refresh auth tokens
 * @param {string} refreshToken
 * @returns {Promise<Object>}
 */
const refreshAuth = async (refreshToken) => {
  try {
    const refreshTokenDoc = await tokenService.verifyToken(refreshToken, tokenTypes.REFRESH);
    const user = await userService.getUserById(refreshTokenDoc.user);
    if (!user) {
      throw new Error();
    }
    await refreshTokenDoc.remove();
    return tokenService.generateAuthTokens(user);
  } catch (error) {
    throw new ApiError(httpStatus.UNAUTHORIZED, 'Please authenticate');
  }
};

/**
 * Reset password
 * @param {string} resetPasswordToken
 * @param {string} newPassword
 * @returns {Promise}
 */
const resetPassword = async (resetPasswordToken, newPassword) => {
  try {
    const resetPasswordTokenDoc = await tokenService.verifyToken(resetPasswordToken, tokenTypes.RESET_PASSWORD);
    const user = await userService.getUserById(resetPasswordTokenDoc.user);
    if (!user) {
      throw new Error();
    }
    await userService.updateUserById(user.id, { password: newPassword });
    await Token.deleteMany({ user: user.id, type: tokenTypes.RESET_PASSWORD });
  } catch (error) {
    throw new ApiError(httpStatus.UNAUTHORIZED, 'Password reset failed');
  }
};

/**
 * Verify PhoneNumber
 * @param {string} verifyPhoneNumberToken
 * @returns {Promise}
 */
const verifyPhoneNumber = async (verifyPhoneNumberToken) => {
  try {
    const verifyPhoneNumberTokenDoc = await tokenService.verifyToken(verifyPhoneNumberToken, tokenTypes.VERIFY_EMAIL);
    const user = await userService.getUserById(verifyPhoneNumberTokenDoc.user);
    if (!user) {
      throw new Error();
    }
    await Token.deleteMany({ user: user.id, type: tokenTypes.VERIFY_EMAIL });
    await userService.updateUserById(user.id, { verified: true });
  } catch (error) {
    throw new ApiError(httpStatus.UNAUTHORIZED, 'PhoneNumber verification failed');
  }
};

module.exports = {
  loginUserWithPhoneAndPassword,
  logout,
  refreshAuth,
  resetPassword,
  verifyPhoneNumber,
};
