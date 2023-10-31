const jwt = require("jsonwebtoken");
const { JWT_SECRET_KEY, JWT_EXPIRES_IN } = require("../helpers/constant");
const values = require("lodash/values");


const signJwtToken = (id) => {
  return jwt.sign({ id }, JWT_SECRET_KEY, {
    expiresIn: JWT_EXPIRES_IN,
  });
};

const getErrorMessage = (errors) => {
  if (errors) {
    const [arr] = values(errors);
    const [message] = arr;
    return message;
  }
  return null;
};

module.exports = { signJwtToken, getErrorMessage };
