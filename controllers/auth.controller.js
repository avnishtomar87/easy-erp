const models = require("../models");
const { Op } = require("sequelize");
const bcrypt = require("bcrypt");
const { getErrorMessage } = require("../utils/token");
const isEmpty = require("lodash/isEmpty");
const validate = require("validate.js");
const catchAsync = require("../utils/catchAsync");
const { AppError } = require("../utils/appError");
const { genericCreate, genericGetOne } = require("../services/generic.service")
const { signJwtToken } = require("../utils/token")

const createSendToken = (user, statusCode, res) => {
  const token = signJwtToken(user.id);
  // const cookieOptions = {
  //   expiresIn: new Date(
  //     Date.now() + JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000
  //   ),
  //   httpOnly: true,
  // };
  // if (NODE_ENV === "production") cookieOptions.secure = true;

  // res.cookie("jwt", token, cookieOptions);

  // Remove password from output
  user.password = undefined;

  res.status(statusCode).json({
    status: "success",
    token,
    data: user,
  });
};

// To register new user
const signUp = catchAsync(async (req, res, next) => {
  const { body } = req;
  const { first_name, last_name, mobile_number, email, password } = body;
  const salt = await bcrypt.genSalt(10);
  const payload = {
    first_name,
    last_name,
    mobile_number,
    email: email.toLowerCase(),
    password: await bcrypt.hash(password, salt),
  };
  const user = await genericCreate("users", payload)
  createSendToken(user.body, 201, res);
});

// for user login
const logIn = catchAsync(async (req, res, next) => {
  const { body } = req;
  const { email, mobile_number, role, password } = body;

  const errors = validate(body, {
    password: { presence: true },
  });
  const message = getErrorMessage(errors);
  if (!isEmpty(message)) {
    res.send({ message });
    return;
  }
  const payload = { email, mobile_number, password };
  const user = await genericGetOne("users", {
    where: {
      [Op.or]: [
        { email: { [Op.eq]: email } },
        { mobile_number: { [Op.eq]: mobile_number } },
      ],
      role
    },
  });
  if (isEmpty(user.body)) return next(new AppError("User not found", 404));
  const password_valid = await bcrypt.compare(payload.password, user.body.password);
  if (!password_valid) {
    return next(new AppError("Incorrect email or password", 400));
  }
  createSendToken(user.body, 200, res);
});

module.exports = {
  signUp,
  logIn,
};
