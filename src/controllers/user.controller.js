const httpStatus = require('http-status');
const pick = require('../utils/pick');
const ApiError = require('../utils/ApiError');
const catchAsync = require('../utils/catchAsync');
const { userService, transactionService } = require('../services');
const { getNamesByNumber } = require('../services/phone.service');

const createUser = catchAsync(async (req, res) => {
  const user = await userService.createUser(req.body);
  res.status(httpStatus.CREATED).send(user);
});

const getUsers = catchAsync(async (req, res) => {
  const filter = pick(req.query, ['name', 'role']);
  const options = pick(req.query, ['sortBy', 'limit', 'page']);
  const result = await userService.queryUsers(filter, options);
  res.send(result);
});

const getUser = catchAsync(async (req, res) => {
  const user = await userService.getUserById(req.params.userId);
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
  }
  res.send(user);
});

const viewTransactionsByUser = catchAsync(async (req, res) => {
  const transactions = await transactionService.viewTransactionsByUser(req.user);
  res.send({ data: transactions });
});

const updateUser = catchAsync(async (req, res) => {
  const user = await userService.updateUserById(req.params.userId, req.body);
  res.send(user);
});

const deleteUser = catchAsync(async (req, res) => {
  await userService.deleteUserById(req.params.userId);
  res.status(httpStatus.NO_CONTENT).send();
});

const validatePhoneNumber = async (req, res) => {
  const name = await getNamesByNumber(req.params.phoneNumber);
  if (name) {
    return res.status(200).send({ status: 200, data: { name, phoneNumber: req.params.phoneNumber } });
  }
  return res.status(200).send({ status: 400, message: 'phone number validation failed' });
};

module.exports = {
  createUser,
  getUsers,
  getUser,
  viewTransactionsByUser,
  updateUser,
  deleteUser,
  validatePhoneNumber,
};
