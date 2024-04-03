const User = require("../models/user");

let userId;

exports.postUserId = (req, res, next) => {
  userId = req.body.userId;
  next();
};

exports.getUser = (req, res, next) => {
  if (!userId) {
    return;
  }

  User.findById(userId)
    .then((user) => res.status(201).json(user.email))
    .catch((err) => console.log(err));
};

exports.getUserListsByAdmin = (req, res, next) => {
  User.find()
    .then((users) => res.json(users))
    .catch((err) => console.log(err));
};
