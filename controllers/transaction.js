const mongoose = require("mongoose");
const Transaction = require("../models/transaction");
const Hotel = require("../models/hotel");
const User = require("../models/user");

exports.createTransaction = (req, res, next) => {
  const hotelId = new mongoose.Types.ObjectId(req.body.hotelId);

  Hotel.findById(hotelId)
    .then((hotel) => {
      const transaction = new Transaction({
        userId: req.body.userId,
        hotelName: hotel.title,
        dateStart: new Date(req.body.startDate).toLocaleDateString(),
        dateEnd: new Date(req.body.endDate).toLocaleDateString(),
        totalPrice: req.body.total,
        payment: req.body.method,
        status: "Booked",
        roomNumber: req.body.roomNumber,
        roomId: req.body.roomId,
      });

      return transaction.save();
    })
    .then((result) => {
      res
        .status(201)
        .json({ message: "Transaction created!", transactionId: result._id });
    })
    .catch((err) => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    });

  User.findByIdAndUpdate(req.body.userId, {
    fullName: req.body.fullName,
    phoneNumber: req.body.phoneNumber,
  })
    .then((result) => {})
    .catch((err) => console.log(err));
};

let userId;

exports.postUserId = (req, res, next) => {
  userId = req.body.userId;
  next();
};

exports.getTransactionByUser = (req, res, next) => {
  if (!userId) {
    return;
  }

  User.findById(userId)
    .then((user) => {
      return Transaction.find({ userId: user._id });
    })
    .then((transactions) => {
      res.status(201).json(transactions);
    })

    .catch((err) => console.log(err));
};

exports.getLatestTransactionByAdmin = (req, res, next) => {
  const transactionData = [];

  Transaction.find()
    .sort({ _id: -1 })
    .limit(8)
    .then((result) => {
      const userIdArr = result.map((itemTransaction) => itemTransaction.userId);

      Promise.all(
        userIdArr.map((id) => {
          return User.find({ _id: id });
        })
      )
        .then((userName) => {
          const userNameArr = userName.map((itemUser) => {
            return itemUser[0].fullName;
          });

          const transactionArr = result.map((itemTransaction) => {
            return itemTransaction;
          });

          for (const i in userNameArr) {
            transactionData.push({
              userName: userNameArr[i],
              transactions: transactionArr[i],
            });
          }

          res.json(transactionData);
        })
        .catch((err) => next(err));
    })
    .catch((err) => next(err));
};

exports.getCountUserByAdmin = (req, res, next) => {
  User.countDocuments()
    .then((countUser) => {
      res.json(countUser);
    })
    .catch((err) => console.log(err));
};

exports.getCountOrderByAdmin = (req, res, next) => {
  Transaction.countDocuments()
    .then((countTransaction) => {
      res.json(countTransaction);
    })
    .catch((err) => console.log(err));
};

exports.getCountEarningByAdmin = (req, res, next) => {
  let earnings = 0;

  Transaction.find()
    .then((transactions) => {
      transactions.map((item) => {
        return (earnings = earnings + item.totalPrice);
      });

      res.json(earnings);
    })
    .catch((err) => console.log(err));
};

exports.getTransactionListsByAdmin = (req, res, next) => {
  const transactionData = [];

  Transaction.find()
    .sort({ _id: -1 })
    .then((result) => {
      const userIdArr = result.map((itemTransaction) => itemTransaction.userId);

      Promise.all(
        userIdArr.map((id) => {
          return User.find({ _id: id });
        })
      )
        .then((userName) => {
          const userNameArr = userName.map((itemUser) => {
            return itemUser[0].fullName;
          });

          const transactionArr = result.map((itemTransaction) => {
            return itemTransaction;
          });

          for (const i in userNameArr) {
            transactionData.push({
              userName: userNameArr[i],
              transactions: transactionArr[i],
            });
          }

          res.json(transactionData);
        })
        .catch((err) => next(err));
    })
    .catch((err) => next(err));
};
