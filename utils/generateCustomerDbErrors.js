const errorCodes = require('./errorCodes');
const { StatusCodes } = require('http-status-codes');
module.exports = {
	findDifference : (x, y) => {
		let diffArray = x.filter(
			(x) => !x.includes(y)
		);
		return diffArray;
	},

	pattern : (x)=>{
		try {
			const pattern_val = x.replace(/\s/g, '')
			return pattern_val;
		} catch (error) {
		}
	},

	generateCustomDbError : (errors) => {
		const customError = {
			status: StatusCodes.INTERNAL_SERVER_ERROR,
			code: 'ERR001',
			message: 'Something went wrong.'
		}
		for (const key in errors) {
			if (Object.hasOwnProperty.call(errors, key)) {
				const element = errors[key];
				customError['status'] = StatusCodes.PRECONDITION_FAILED
				customError['code'] = errorCodes[element.path]
				break;
			}
		}
		return customError;
	},

	isSpaceContaines: (str) => {
		return str.indexOf(' ') >= 0;
	},

	isValidaEmail : (email) => { 
		const mailformat = /^([A-Za-z0-9_\-\.])+\@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,4})$/;
		return email.match(mailformat)
	},

	isValidMobile: (mobile) => {
		return ( isNaN(mobile) || mobile.length != 10 );
	},

	updateObjectInArray: (key, value, arr, userid) => {
		for (let i = 0; i < arr.length; i++) {
			arr[i][key] = value;
			if (userid) {
				arr[i]['createdBy'] = userid
				arr[i]['updatedBy'] = userid
			}
		}
		return arr;
	} 
    
}