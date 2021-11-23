const express = require('express');
const auth = require('../../middlewares/auth');
// const validate = require('../../middlewares/validate');
// const userValidation = require('../../validations/user.validation');
const walletController = require('../../controllers/wallet.controller');

const router = express.Router();

router
  .route('/')
  .post(auth('manageUsers'), walletController.creditWallet)
  .get(auth('manageUsers'), walletController.viewWallet)
  .patch(auth('manageUsers'), walletController.debitWallet);

module.exports = router;
