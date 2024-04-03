const express = require("express");

const verify = require("../util/verifyToken");

const hotelController = require("../controllers/hotel");

const router = express.Router();

// Admin Create Hotel
router.post(
  "/admin/addNewHotel",
  verify.verifyAdmin,
  hotelController.addNewHotelByAdmin
);

// Admin Update Hotel
router.post(
  "/admin/updateHotel",
  verify.verifyAdmin,
  hotelController.updateHotelByAdmin
);

router.get(
  "/admin/getHotel",
  verify.verifyAdmin,
  hotelController.getHotelByAdmin
);

// Admin Delete Hotel
router.post(
  "/admin/deleteHotel",
  verify.verifyAdmin,
  hotelController.deleteHotelByAdmin
);

// Admin Get Hotel List
router.get(
  "/admin/getHotelLists",
  verify.verifyAdmin,
  hotelController.getHotelListsByAdmin
);

// Fetch Hotel Id
router.post("/postHotelId", hotelController.postHotelId);

// Get Hotel by Id
router.get("/getHotelById", hotelController.getHotelById);

// Get Hotel By City
router.get("/getByCity", hotelController.getByCity);

// Get Hotel By Type
router.get("/getByType", hotelController.getByType);

//
router.get("/getByRating", hotelController.getByRating);

//
router.get("/getAvailableRoomsByHotel", hotelController.getAvailableRooms);

//
router.post("/getHotelBySearch", hotelController.getHotelBySearch);

module.exports = router;
