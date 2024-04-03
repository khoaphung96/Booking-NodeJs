const express = require("express");

const verify = require("../util/verifyToken");

const transactionController = require("../controllers/transaction");

const router = express.Router();

router.get(
  "/countUser",
  verify.verifyAdmin,
  transactionController.getCountUserByAdmin
);

router.get(
  "/countOrder",
  verify.verifyAdmin,
  transactionController.getCountOrderByAdmin
);

router.get(
  "/countEarning",
  verify.verifyAdmin,
  transactionController.getCountEarningByAdmin
);

router.get(
  "/getTransactionLists",
  verify.verifyAdmin,
  transactionController.getTransactionListsByAdmin
);

router.get(
  "/getLatestTransaction",
  verify.verifyAdmin,
  transactionController.getLatestTransactionByAdmin
);

//
router.post("/postUserId", transactionController.postUserId);

//
router.get(
  "/getByUser",
  verify.verifyUser,
  transactionController.getTransactionByUser
);

//
router.post(
  "/createTransaction",
  verify.verifyUser,
  transactionController.createTransaction
);

module.exports = router;
