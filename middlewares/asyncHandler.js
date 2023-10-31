const {AppError} = require("../utils/appError");

exports.asyncHandler = (fn) => {
  return function asyncUtilWrap(...args) {
    const fnReturn = fn(...args);
    const next = args[args.length - 1];
    return Promise.resolve(fnReturn).catch((e) => {
      if (e instanceof AppError) {
        next(e);
      } else {
        next(new AppError(e.message, 500));
      }
    });
  };
};
