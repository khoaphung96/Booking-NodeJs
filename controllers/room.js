const Hotel = require("../models/hotel");
const Room = require("../models/room");
const Transaction = require("../models/transaction");

exports.getRoomListsByAdmin = (req, res, next) => {
  Room.find()
    .then((rooms) => res.json(rooms))
    .catch((err) => console.log(err));
};

exports.deleteRoomByAdmin = (req, res, next) => {
  const roomId = req.body.id;
  let roomIdArr = [];

  Transaction.find().then((result) => {
    const arr = result.map((item) => {
      return item.roomId;
    });

    for (const i in arr) {
      if (arr[i].length > 1) {
        for (const u in arr[i]) {
          roomIdArr.push(arr[i][u]);
        }
      }

      if (arr[i].length === 1) {
        roomIdArr.push(String(arr[i]));
      }
    }

    let checkDifferent = true;

    for (const i in roomIdArr) {
      if (roomIdArr[i] === roomId) {
        checkDifferent = false;
      }
    }

    if (!checkDifferent) {
      return res.json({ message: "Can't Delete Room!" });
    }

    if (checkDifferent) {
      Room.findByIdAndDelete(roomId).then((result) =>
        res.json({ message: "Deleted Room!" })
      );
    }
  });
};

exports.addNewRoomByAdmin = (req, res, next) => {
  const room = new Room({
    desc: req.body.desc,
    maxPeople: req.body.maxPeople,
    roomNumbers: req.body.rooms,
    title: req.body.title,
    price: req.body.price,
  });

  return room
    .save()
    .then((result) => {
      res.status(201).json({ message: "Room created!", roomId: result._id });
    })
    .catch((err) => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    });
};

let roomId;

exports.postRoomIdByAdmin = (req, res, next) => {
  roomId = req.body.id;
  next();
};

exports.getRoomByAdmin = (req, res, next) => {
  if (!roomId) {
    return;
  }

  Room.findById(roomId)
    // .exec()
    .then((result) => {
      res.json(result);
    })
    .catch((err) => console.log(err));
};

exports.updateRoomByAdmin = (req, res, next) => {
  if (!roomId) {
    return;
  }

  const update = {
    desc: req.body.desc,
    maxPeople: req.body.maxPeople,
    roomNumbers: req.body.rooms,
    title: req.body.title,
    price: req.body.price,
  };

  Room.findByIdAndUpdate(roomId, update)
    .then((result) => res.status(200).json({ message: "Room Updated!" }))
    .catch((err) => console.log(err));
};
