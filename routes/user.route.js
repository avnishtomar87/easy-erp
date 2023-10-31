const Router = require("express");
const usersController = require("../controllers/users.controller");
const { asyncHandler } = require("../middlewares/asyncHandler");
const { validateBasicAuth,validateRequestBody } = require("../middlewares/validators");
const {
  validateUserAuthentication,
  restrictTo,
} = require("../middlewares/userAuth");
const { UserJoiSchema } = require("../joi/users.joi")

function userRouter() {
  const router = Router();

  router
    .route("/users")
    .get(
      asyncHandler(validateBasicAuth()),
      asyncHandler(validateUserAuthentication),
      asyncHandler(restrictTo("admin")),
      asyncHandler(usersController.getAllUsers)
    );

  router
    .route("/users/:id")
    .get(
      asyncHandler(validateBasicAuth()),
      asyncHandler(validateUserAuthentication),
      asyncHandler(restrictTo("admin", "user")),
      asyncHandler(usersController.getUserById)
    )
    .patch(
      asyncHandler(validateBasicAuth()),
      asyncHandler(validateUserAuthentication),
      asyncHandler(restrictTo("admin", "user")),
      asyncHandler(validateRequestBody(UserJoiSchema.updateUser)),
      asyncHandler(usersController.updateUser)
    )
    .delete(
      asyncHandler(validateBasicAuth()),
      asyncHandler(validateUserAuthentication),
      asyncHandler(restrictTo("admin", "user")),
      asyncHandler(usersController.deleteUserById)
    );
  return router;
}



module.exports = { userRouter };
