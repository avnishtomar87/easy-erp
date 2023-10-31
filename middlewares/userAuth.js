const jsonwebtoken = require("jsonwebtoken");
const { JWT_SECRET_KEY } = require("../helpers/constant");
const models = require("../models");
const { users } = models;
const catchAsync = require("../utils/catchAsync");
const { AppError } = require("../utils/appError");
const { promisify } = require("util");

function verifyToken(req, res, next) {
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.split(" ")[1];
  if (token == null)
    return res.status(401).send({ message: "Unauthorized access." });
  jsonwebtoken.verify(token, JWT_SECRET_KEY, (err, user) => {
    if (err) return res.status(403).send({ message: "Access forbidden." });
    req.user = user;
    next();
  });
}

const validateUserAuthentication = catchAsync(async (req, res, next) => {
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  }
  if (!token) {
    throw new AppError(
      "You are not logged in! Please log in to get access..",
      500
    );
  }
  const decoded = await promisify(jsonwebtoken.verify)(token, JWT_SECRET_KEY);
  const currentUser = await users.findOne({ where: { id: decoded.id } });
  if (!currentUser) {
    throw new AppError(
      "The user belonging to this token does no longer exist.",
      500
    );
  }

  // 4) Check if user changed password after the token was issued
  // if (currentUser.changedPasswordAfter(decoded.iat)) {
  //   return next(
  //     new AppError("User recently changed password! Please log in again.", 401)
  //   );
  // }

  req.user = currentUser;
  req.isAdmin = currentUser.role === "admin";
  // res.locals.user = currentUser;
  next();
});

const restrictTo = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      throw new AppError(
        "You do not have permission to perform this action.",
        500
      );
    }
    next();
  };
};

module.exports = { validateUserAuthentication, restrictTo, verifyToken };
