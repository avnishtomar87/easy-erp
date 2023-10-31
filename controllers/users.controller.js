const catchAsync = require("../utils/catchAsync");
const { AppError, Forbidden } = require("../utils/appError");
const { genericGetAll, genericGetById, genericDelete, genericUpdate } = require("../services/generic.service")
const { Op } = require("sequelize");


// get all users data
const getAllUsers = catchAsync(async (req, res, next) => {
  const { email, last_name, first_name, keyword, include, exclude } = req.query;
  const isAdmin = req.isAdmin;
  // step - check - only admin can access others data
  if (!isAdmin) {
    throw new Forbidden();
  }
  const page = req.query && req.query.page ? parseInt(req.query.page) : 0;
  const limit = req.query && req.query.limit ? parseInt(req.query.limit) : 50;
  const order = req.query && req.query.order ? req.query.order : "ASC";
  const order_by = req.query && req.query.order_by ? req.query.order_by : "id";

  let where = {
    [Op.or]: {
      email: {
        [Op.iLike]: `%${keyword ? keyword : "%"}%`,
      },
      first_name: {
        [Op.iLike]: `%${keyword ? keyword : "%"}%`,
      },
      last_name: {
        [Op.iLike]: `%${keyword ? keyword : "%"}%`,
      },
    },
    role: "user"
  };
  if (email) {
    where.email = email;
  }
  if (last_name) {
    where.last_name = last_name;
  }
  if (first_name) {
    where.first_name = first_name;
  }
  let excludeFields = [];
  let includeFields = [];
  let attributes;
  if (include) {
    includeFields = JSON.parse(`${include}`);
    attributes = includeFields;
  }
  if (exclude) {
    excludeFields = exclude;
    attributes = { exclude: excludeFields };
  }

  const data = await genericGetAll("users", {
    where, limit,
    offset: page * limit,
    order: [[order_by, order]],
    attributes,
  })

  // Remove password from output
  data.password = undefined;

  res.status(201).json({
    status: "success",
    count: data.length,
    data: data.body,
  });
});



//get specific user data by id
const getUserById = catchAsync(async (req, res, next) => {
  const {
    params: { id },
  } = req;
  const isAdmin = req.isAdmin;

  // step - check - only admin can access others data
  if (!isAdmin && (parseInt(id) != req.user.id)) {
    throw new Forbidden();
  }
  const data = await genericGetById("users", id);
  if (!data) {
    return next(new AppError("No user found with that ID", 404));
  }
  // Remove password from output
  data.body.password = undefined;
  res.status(201).json({
    status: "success",
    data: data.body,
  });
});


// update users data
const updateUser = catchAsync(async (req, res, next) => {
  const {
    body: { first_name, last_name },
    params: { id },
  } = req;
  const isAdmin = req.isAdmin;

  // step - check - only admin can access others data
  if (!isAdmin && (parseInt(id) != req.user.id)) {
    throw new Forbidden();
  }
  const result = await genericUpdate('users', { first_name, last_name }, { where: { id } })
  res.status(result.status || 200)
  res.json(result.body);
});




// delete a user
const deleteUserById = catchAsync(async (req, res, next) => {
  const {
    params: { id },
  } = req;
  if (!id.trim()) {
    return next(new AppError("invalid request", 400));

  }
  const isAdmin = req.isAdmin;

  if (!isAdmin && parseInt(id) !== req.user.id) {
    throw new Forbidden();
  }
  let result = await genericDelete('users', { where: { id } });
  if (result.body === 0) {
    return next(new AppError("No user found with that ID", 404));
  }
  res.status(result.status || 200)
  res.json(result.body);
});

module.exports = {
  updateUser,
  getAllUsers,
  getUserById,
  deleteUserById,
};
