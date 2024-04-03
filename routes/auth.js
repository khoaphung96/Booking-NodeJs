const express = require("express");
const { check, body } = require("express-validator/check");

const authController = require("../controllers/auth");

const User = require("../models/user");

const router = express.Router();

router.post("/login", authController.postLogin);

router.post(
  "/signup",
  [
    body("email")
      .isEmail()
      .withMessage("Please enter a valid email.")
      .custom((value, { req }) => {
        return User.findOne({ email: value }).then((userDoc) => {
          console.log(userDoc);
          if (userDoc) {
            return Promise.reject("E-Mail address already exists!");
          }
        });
      })
      .normalizeEmail(),
    body("userName").trim().not().isEmpty(),
    // body("fullName").trim().not().isEmpty(),
    // body("phoneNumber").trim().not().isEmpty(),
    body("password").trim(),
    // body("confirmPassword")
    //   .trim()
    //   .custom((value, { req }) => {
    //     if (value !== req.body.password) {
    //       throw new Error("Password have to match!");
    //     }
    //     return true;
    //   }),
  ],
  authController.postSignup
);

router.post("/logout", authController.postLogout);

module.exports = router;
