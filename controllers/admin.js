const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const { validationResult } = require("express-validator/check");

const Admin = require("../models/admin");

exports.postLogin = (req, res, next) => {
  const email = req.body.email;
  const password = req.body.password;

  let loadedAdmin;

  Admin.findOne({ email: email })
    .then((admin) => {
      if (!admin) {
        const error = new Error("A admin with this email could not be found.");
        error.statusCode = 401;
        throw error;
      }
      loadedAdmin = admin;
      return bcrypt.compare(password, admin.password);
    })
    .then((isEqual) => {
      if (!isEqual) {
        const error = new Error("Wrong password!");
        error.statusCode = 401;
        throw error;
      }

      const token = jwt.sign(
        {
          email: loadedAdmin.email,
          adminId: loadedAdmin._id.toString(),
          isAdmin: loadedAdmin.isAdmin,
        },
        "somesupersecretsecret"
      );

      res.status(200).json({
        message: "Authenticated!",
        accessToken: token,
        adminId: loadedAdmin._id.toString(),
        isAdmin: loadedAdmin.isAdmin,
      });
    })
    .catch((err) => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    });
};

exports.postSignup = (req, res, next) => {
  const email = req.body.email;
  const userName = req.body.userName;
  const password = req.body.password;
  // const confirmPassword = req.body.confirmPassword;
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    const error = new Error("Validation failed.");
    error.statusCode = 422;
    error.data = errors.array();
    throw error;
  }

  bcrypt
    .hash(password, 12)
    .then((hashedPassword) => {
      const admin = new Admin({
        email: email,
        userName: userName,
        password: hashedPassword,
        isAdmin: true,
      });

      return admin.save();
    })
    .then((result) => {
      res.status(201).json({ message: "Admin created!", adminId: result._id });
    })
    .catch((err) => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    });
};
