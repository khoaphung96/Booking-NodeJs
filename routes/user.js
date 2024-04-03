const express = require("express");

const userController = require("../controllers/user");

const verify = require("../util/verifyToken");

const router = express.Router();

router.post("/postUserId", userController.postUserId);

router.get("/getUser", verify.verifyUser, userController.getUser);

router.get(
  "/admin/getUserLists",
  verify.verifyAdmin,
  userController.getUserListsByAdmin
);

module.exports = router;
