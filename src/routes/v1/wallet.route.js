const express = require('express');
const auth = require('../../middlewares/auth');
// const validate = require('../../middlewares/validate');
// const userValidation = require('../../validations/user.validation');
const walletController = require('../../controllers/wallet.controller');
const { getReceiver } = require('../../middlewares/user');

const router = express.Router();

router
  .route('/')
  .get(auth('manageUsers'), walletController.viewWallet)
  .patch(auth('manageUsers'), walletController.debitWallet);

router.route('/:email').post(auth('manageUsers'), getReceiver, walletController.creditWallet);

router.route('/send_credit').post(auth('manageUsers'), getReceiver, walletController.sendCredit);

module.exports = router;
