const db = require('../models');
const { StatusCodes } = require('http-status-codes');
const { generateCustomDbError } = require('../utils/generateCustomerDbErrors');
const { AppError } = require("../utils/appError");

/**
 * 
 * @param {string} modelName 
 * @param {*} data 
 * @param {Object} opt 
 * @param {string} opt.customId
 */

const genericCreate = async (modelName, data, opt = {}) => {
	try {
		let result = {};
		// can add validation or skips here
		result.body = await db[modelName].create({ ...data }, opt);
		result.status = StatusCodes.CREATED;
		// can add audit here
		return result;
	} catch (error) {
		const errors = error && error['errors'] ? error['errors'] : [];
		const customError = generateCustomDbError(errors);
		throw new AppError(errors[0].message, customError.status);
	}
}

/**
 * 
 * @param {string} modelName 
 * @param {*} data 
 * @param {Object} opt 
 * @param {string} opt.customId
 */

const genericUpdate = async (modelName, data, opt = {}) => {
	let result = {};
	// can add validation or skips here
	result.body = await db[modelName].update({ ...data }, opt);
	result.status = StatusCodes.OK;
	// can add audit here
	return result;
}


/**
 * 
 * @param {string} modelName 
 * @param {*} data 
 * @param {Object} opt 
 */

const genericBulkCreate = async (modelName, data, opt = {}) => {
	let result = {};
	// can add validation or skips here
	result.body = await db[modelName].bulkCreate(data, opt);
	result.status = StatusCodes.CREATED;
	// can add audit here
	return result;
}

/**
 * 
 * @param {string} modelName 
 * @param {Object} opt 
 */

const genericDelete = async (modelName, opt) => {
	try {
		let result = {};
		// see check conditions for options
		if (opt == undefined || opt == null || opt == {}) {
			result.status = StatusCodes.BAD_REQUEST;
			return result;
		}
		result.body= await db[modelName].destroy(opt);
		// can add audit here
		result.status = StatusCodes.OK;
		return result;
	} catch (error) {
		// logger.error({error});
		return false;
	}
}

/**
 * 
 * @param {string} modelName 
 * @param {string} id 
 */

const genericGetById = async (modelName, id) => {
	let result = {};
	// see check conditions for options
	if (!id) {
		result.status = StatusCodes.BAD_REQUEST;
		return result;
	}
	result.body = await db[modelName].findByPk(id);
	// can add audit here
	result.status = StatusCodes.OK;
	return result;
}


/**
 * 
 * @param {string} modelName 
 * @param {string} id 
 */

const genericGetOne = async (modelName, opt) => {
	let result = {};
	// see check conditions for options
	if (opt == undefined || opt == null || opt == {}) {
		result.status = StatusCodes.BAD_REQUEST;
		return result;
	}
	result.body = await db[modelName].findOne(opt);
	// can add audit here
	result.status = StatusCodes.OK;
  
	return result;
}

/**
 * 
 * @param {string} modelName 
 * @param {string} id 
 */

const genericGetAll = async (modelName, opt) => {

	let result = {};
	// see check conditions for options
	// set default ofsets 
	// set Statuscodes.parcials
	if (opt == undefined || opt == null || opt == {}) {
		result.status = StatusCodes.BAD_REQUEST;
		return result;
	}
	result.body = await db[modelName].findAll(opt);
	// can add audit here
	result.status = StatusCodes.OK;
	return result;
}

/**
 * 
 * @param {string} modelName 
 * @param {string} id 
 */

const genericGetAndCountAll = async (modelName, opt) => {
	let result = {};
	let count = 0;
	// see check conditions for options
	// set default ofsets 
	// set Statuscodes.parcials
	if (opt == undefined || opt == null || opt == {}) {
		result.status = StatusCodes.BAD_REQUEST;
		return result;
	}
	if(!opt.limit)
		opt.limit = 10
	result.body = await db[modelName].findAndCountAll(opt);
	// when there is join we need to count whole record from the model with the specified condition
	// commenting this due to some other issue
	// if("include" in opt) {
	// result.body.count = await db[modelName].count({where: opt.where || {}});
	// }
	// can add audit here
	result.status = StatusCodes.OK;
	return result;
}

/**
 * @param {string} modelName
 * @param {object} opt
 */
const isRowExist = async (modelName, opt) =>{ 
	try {
		const exists = await db[modelName].count({where: opt.where || {}});
		if (exists) {
			return true;
		}
		return false;
	} catch (error) {
		logger.error({error})
		return false;
	}
}

module.exports = {
	genericCreate,
	genericUpdate,
	genericBulkCreate,
	genericDelete,
	genericGetAll,
	genericGetAndCountAll,
	genericGetById,
	genericGetOne,
	isRowExist
}