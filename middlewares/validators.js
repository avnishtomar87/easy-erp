const { BASIC_AUTH } = require("../helpers/constant");
const {AppError} = require("../utils/appError");

const validateRequestBody = (schema) => {
  return async (req, res, next) => {
    try {
      const data = await schema.validateAsync(req.body, {
        abortEarly: false,
        convert: true, // this will convert values are required
      });
      // overwrite body - due to conversion
      req.body = data;
      next();
    } catch (error) {
      res.status(422).send({
        errors: error.details,
      });
    }
  };
};

const validateBasicAuth = () => {
  return (req, res, next) => {
    const basicAuth = BASIC_AUTH;
    const basicAuthHeader = req.header("BasicAuth");
    if (basicAuthHeader !== basicAuth) {
        throw new AppError("Missing Basic Auth!", 401);
      // res.status(403).json({ error: 'Missing Auth!' }).send();
    } else {
      next();
    }
  };
};

module.exports = { validateRequestBody, validateBasicAuth };
