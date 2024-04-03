const Hotel = require("../models/hotel");
const Room = require("../models/room");
const Transaction = require("../models/transaction");

exports.getByCity = (req, res, next) => {
  const cityArray = ["Ha Noi", "Ho Chi Minh", "Da Nang"];

  Promise.all(
    cityArray.map((city) => {
      return Hotel.countDocuments({ city: city });
    })
  )
    .then((listNumberArray) => {
      res.json(listNumberArray);
    })
    .catch((err) => {
      next(err);
    });
};

exports.getByType = (req, res, next) => {
  const typeArray = ["hotel", "Apartments", "Resorts", "Villas", "Cabins"];

  Promise.all(
    typeArray.map((type) => {
      return Hotel.countDocuments({ type: type });
    })
  )
    .then((listNumberArray) => {
      res.json(listNumberArray);
    })
    .catch((err) => {
      next(err);
    });
};

exports.getByRating = (req, res, next) => {
  Hotel.find()
    .sort({ rating: -1 })
    .limit(3)
    .then((result) => res.json(result))
    .catch((err) => next(err));
};

let hotelId;

exports.postHotelId = (req, res, next) => {
  hotelId = req.body.id;
  next();
};

exports.getHotelById = (req, res, next) => {
  if (!hotelId) {
    return;
  }

  Hotel.findById(hotelId)
    .exec()
    .then((result) => {
      res.json(result);
    })
    .catch((err) => console.log(err));
};

exports.getAvailableRooms = (req, res, next) => {
  let numberArr;

  Hotel.findById(hotelId)
    .then((hotel) => {
      numberArr = hotel.rooms.map((item) => {
        return item._id;
      });

      Promise.all(
        numberArr.map((item) => {
          return Room.find({ _id: item._id });
        })
      )
        .then((roomArr) => {
          const roomInfoBookedArr = [];
          const roomInfoAlldArr = [];
          const roomNumberAvailableArr = [];
          const roomNumberIdAvailableArr = [];
          const roomAvailableArr = [];

          Transaction.find()
            .then((items) => {
              items.map((item) => {
                for (const i in item.roomNumber) {
                  roomInfoBookedArr.push({
                    roomId: item.roomId[i],
                    roomNumber: item.roomNumber[i].toString(),
                  });
                }
              });
              // console.log(roomInfoBookedArr);

              roomArr.map((item) => {
                item[0].roomNumbers.map((roomNumber) =>
                  roomInfoAlldArr.push({
                    roomId: item[0]._id.toString(),
                    roomNumber: roomNumber.toString().slice(7, 10),
                    roomNumberId: roomNumber.toString().slice(31, 55),
                  })
                );
              });

              for (const i in roomInfoAlldArr) {
                roomInfoBookedArr.map((item) => {
                  if (
                    item.roomId === roomInfoAlldArr[i].roomId &&
                    item.roomNumber === roomInfoAlldArr[i].roomNumber
                  ) {
                    return roomInfoAlldArr.splice(Number(i), 1);
                  }
                });
              }

              const roomIdAvailableArr = roomInfoAlldArr.map((item) => {
                return item.roomId;
              });

              roomInfoAlldArr.map((item) => {
                roomNumberAvailableArr.push({
                  roomNumber: item.roomNumber,
                  roomNumberId: item.roomNumberId,
                  roomId: item.roomId,
                });
              });

              roomInfoAlldArr.map((item) => {
                roomNumberIdAvailableArr.push(item.roomNumberId);
              });

              const unique = (arr) => {
                var newArr = [];
                for (var i = 0; i < arr.length; i++) {
                  if (!newArr.includes(arr[i])) {
                    newArr.push(arr[i]);
                  }
                }
                return newArr;
              };

              const roomIdAvailableUniqeArr = unique(roomIdAvailableArr);

              roomArr.map((item) => {
                for (const i in roomIdAvailableUniqeArr) {
                  if (item[0]._id.toString() === roomIdAvailableUniqeArr[i]) {
                    roomAvailableArr.push(item[0]);
                  }
                }
              });

              res.json({
                roomInfo: roomAvailableArr,
                roomAvailable: roomNumberAvailableArr,
              });
            })
            .catch((err) => console.log(err));
        })
        .catch((err) => console.log(err));
    })
    .catch((err) => console.log(err));
};

exports.getHotelListsByAdmin = (req, res, next) => {
  Hotel.find()
    .then((hotels) => res.json(hotels))
    .catch((err) => console.log(err));
};

exports.deleteHotelByAdmin = (req, res, next) => {
  const hotelId = req.body.id;

  Hotel.findById(hotelId).then((hotel) => {
    Transaction.find({ hotelName: hotel.name }).then((result) => {
      if (result.length > 0) {
        return res.json({ message: "Can't Delete Hotel!" });
      }

      if (result.length === 0) {
        Hotel.findByIdAndDelete(hotelId).then((result) =>
          res.json({ message: "Deleted Hotel!" })
        );
      }
    });
  });
};

exports.addNewHotelByAdmin = (req, res, next) => {
  const hotel = new Hotel({
    address: req.body.address,
    cheapestPrice: req.body.price,
    city: req.body.city,
    desc: req.body.desc,
    distance: req.body.distance,
    featured: req.body.featured,
    name: req.body.name,
    photos: "file",
    rooms: req.body.rooms,
    title: req.body.title,
    type: req.body.type,
    rating: req.body.rating,
  });

  return hotel
    .save()
    .then((result) => {
      res.status(201).json({ message: "Hotel created!", hotelId: result._id });
    })
    .catch((err) => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    });
};

exports.getHotelByAdmin = (req, res, next) => {
  if (!hotelId) {
    return;
  }

  Hotel.findById(hotelId)
    .then((result) => {
      res.json(result);
    })
    .catch((err) => console.log(err));
};

exports.updateHotelByAdmin = (req, res, next) => {
  if (!hotelId) {
    return;
  }

  const update = {
    address: req.body.address,
    cheapestPrice: req.body.price,
    city: req.body.city,
    desc: req.body.desc,
    distance: req.body.distance,
    featured: req.body.featured,
    name: req.body.name,
    photos: "file",
    rooms: req.body.rooms,
    title: req.body.title,
    type: req.body.type,
    rating: req.body.rating,
  };

  Hotel.findByIdAndUpdate(hotelId, update)
    .then((result) => res.status(200).json({ message: "Hotel Updated!" }))
    .catch((err) => console.log(err));
};

exports.getHotelBySearch = (req, res, next) => {
  const city = req.body.destination;

  Hotel.find({ city: city })
    .then((result) => {
      res.json(result);
    })
    .catch((err) => console.log(err));
};
