const express = require('express');
const auth = require('../../middlewares/auth');
const userController = require('../../controllers/user.controller');
const walletController = require('../../controllers/wallet.controller');
const { getReceiver, checkDuplicateSend, checkAmountLimit } = require('../../middlewares/user');

const router = express.Router();
router.route('/transactions').get(auth('manageUsers'), userController.viewTransactionsByUser);
router
  .route('/send_money/:phoneNumber')
  .post(auth('manageUsers'), getReceiver, checkDuplicateSend, checkAmountLimit, walletController.sendMoney);

module.exports = router;
