const express = require('express');
const auth = require('../../middlewares/auth');
const transactionController = require('../../controllers/transaction.controller');

const router = express.Router();


router
  .route('/')
  .post(auth('manageUsers'), transactionController.createTransaction)
  .get(auth('manageUsers'), transactionController.viewTransactions);

router
  .route('/:id')
  .get(auth('manageUsers'), transactionController.viewTransaction)
  .patch(auth('manageUsers'), transactionController.updateTransaction);

  

module.exports = router;
