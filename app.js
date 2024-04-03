const path = require("path");

const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const session = require("express-session");
const MongoDBStore = require("connect-mongodb-session")(session);

// const multer = require("multer");

const MONGODB_URI =
  "mongodb+srv://dangkhoa34:khoa34pro81@cluster0.3fp1xgt.mongodb.net/booking?retryWrites=true";

const app = express();

const store = new MongoDBStore({
  uri: MONGODB_URI,
  collection: "sessions",
});

// const fileStorage = multer.diskStorage({
//   destination: (req, file, cb) => {
//     cb(null, "images");
//   },
//   filename: (req, file, cb) => {
//     cb(null, file.originalname);
//   },
// });

// const fileFilter = (req, file, cb) => {
//   if (
//     file.mimetype === "image/png" ||
//     file.mimetype === "image/jpg" ||
//     file.mimetype === "image/jpeg"
//   ) {
//     cb(null, true);
//   } else {
//     cb(null, false);
//   }
// };

const authRoutes = require("./routes/auth");
const hotelRoutes = require("./routes/hotel");
const transactionRouter = require("./routes/transaction");
const userRoutes = require("./routes/user");
const adminRoutes = require("./routes/admin");
const roomRouter = require("./routes/room");

app.use(cors());

app.use(bodyParser.json());
// app.use(
//   multer({ storage: fileStorage, fileFilter: fileFilter }).single("image")
// );
app.use(express.static(path.join(__dirname, "public")));
app.use("/images", express.static(path.join(__dirname, "images")));
// app.use(
//   session({
//     secret: "my secret",
//     resave: false,
//     saveUninitialized: false,
//     store: store,
//   })
// );

app.use(authRoutes);
app.use(hotelRoutes);
app.use(userRoutes);
app.use("/transaction", transactionRouter);
app.use("/admin", adminRoutes);
app.use(roomRouter);

mongoose
  .connect(MONGODB_URI)
  .then((result) => {
    app.listen(5000);
  })
  .catch((err) => {
    console.log(err);
  });
