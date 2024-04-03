const jwt = require("jsonwebtoken");

exports.verifyAdmin = (req, res, next) => {
  const authHeader = req.get("Authorization");

  if (authHeader === "null") {
    const error = new Error("Not authenticated.");
    error.statusCode = 401;
    throw error;
  }

  let decodedToken;

  try {
    decodedToken = jwt.verify(authHeader, "somesupersecretsecret");
  } catch (err) {
    err.statusCode = 500;
    throw err;
  }

  if (!decodedToken) {
    const error = new Error("Not authenticated.");
    error.statusCode = 401;
    throw error;
  }

  next();
};

exports.verifyUser = (req, res, next) => {
  const authHeader = req.get("Authorization");

  if (authHeader === "null") {
    const error = new Error("Not authenticated.");
    error.statusCode = 401;
    throw error;
  }

  let decodedToken;

  try {
    decodedToken = jwt.verify(authHeader, "somesupersecretsecret");
  } catch (err) {
    err.statusCode = 500;
    throw err;
  }

  if (!decodedToken) {
    const error = new Error("Not authenticated.");
    error.statusCode = 401;
    throw error;
  }

  next();
};
