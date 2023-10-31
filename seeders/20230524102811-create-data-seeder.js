"use strict";
const bcrypt = require("bcrypt");

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const salt = await bcrypt.genSalt(10);
    const password = await bcrypt.hash("admin@123", salt)
    return queryInterface.bulkInsert('users', [{
      first_name: "admin",
      last_name: "admin",
      mobile_number:"7896543215",
      email: 'admin@gmail.com',
      password: password,
      role: 'admin',
      createdAt: new Date(),
      updatedAt: new Date()
    }]);
  }, down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('users', { email: 'admin@gmail.com' }, {});
  }
};