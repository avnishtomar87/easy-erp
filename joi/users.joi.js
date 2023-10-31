const Joi = require("joi");
const AuthJoiSchema = {
    Login: Joi.object({
        role: Joi.string().trim().normalize().required(),
        password: Joi.string().trim().normalize().required(),
        email: Joi.string().email().trim().normalize(),
        mobile_number: Joi.string().regex(/^[0-9]{10}$/),
    }).or('email', 'mobile_number').messages({
        'object.missing': 'Please provide either an email or a mobile number.',
    }).required(),
    Signup: Joi.object({
        first_name: Joi.string().trim().normalize(),
        last_name: Joi.string().trim().normalize(),
        email: Joi.string().email().trim().normalize().required(),
        password: Joi.string().trim().normalize().required(),
        mobile_number: Joi.string()
            .regex(/^[0-9]{10}$/)
            .messages({
                "string.pattern.base": "invalid mobile",
            }),
    }).required(),
};

const UserJoiSchema = {
    updateUser: Joi.object({
        first_name: Joi.string().trim().normalize(),
        last_name: Joi.string().trim().normalize(),
    }).required(),
};

module.exports = { AuthJoiSchema, UserJoiSchema }