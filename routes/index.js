const Router = require("express");
const { authRouter } = require("./auth.routes")
const { userRouter } = require("./user.route")

function loadRouter() {
    const router = Router();
    router.use('/auth', authRouter());
    router.use('/', userRouter());
    return router;
}

module.exports = { loadRouter }
