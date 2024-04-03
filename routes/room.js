const express = require("express");

const verify = require("../util/verifyToken");

const roomController = require("../controllers/room");

const router = express.Router();

router.post(
  "/admin/addNewRoom",
  verify.verifyAdmin,
  roomController.addNewRoomByAdmin
);

// Post Room Id
router.post(
  "/admin/postRoomId",
  verify.verifyAdmin,
  roomController.postRoomIdByAdmin
);

router.get("/admin/getRoom", verify.verifyAdmin, roomController.getRoomByAdmin);

// Admin Update Hotel
router.post(
  "/admin/updateRoom",
  verify.verifyAdmin,
  roomController.updateRoomByAdmin
);

// Admin Delete Hotel
router.post(
  "/admin/deleteRoom",
  verify.verifyAdmin,
  roomController.deleteRoomByAdmin
);

router.get(
  "/admin/getRoomLists",
  verify.verifyAdmin,
  roomController.getRoomListsByAdmin
);

module.exports = router;
