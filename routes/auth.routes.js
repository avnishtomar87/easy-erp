const Router = require("express");
const authController = require("../controllers/auth.controller");
const {
  validateBasicAuth,
  validateRequestBody,
} = require("../middlewares/validators");
const { asyncHandler } = require("../middlewares/asyncHandler");
const { AuthJoiSchema } = require("../joi/users.joi")

function authRouter() {
  const router = Router();
  router.post(
    "/signup",
    asyncHandler(validateBasicAuth()),
    asyncHandler(validateRequestBody(AuthJoiSchema.Signup)),
    asyncHandler(authController.signUp)
  );

  router.post(
    "/login",
    asyncHandler(validateBasicAuth()),
    asyncHandler(validateRequestBody(AuthJoiSchema.Login)),
    asyncHandler(authController.logIn)
  );
  return router;
}

module.exports = { authRouter };
