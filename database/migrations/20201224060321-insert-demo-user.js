'use strict';
const bcrypt = require("bcryptjs");

const { name, email, password, image_url } = require('../../src/config/demoUser');

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert("users", [{
      name,
      email,
      password_hash: await bcrypt.hash(password, 8),
      image_url,
      created_at: new Date(),
      updated_at: new Date(),
    }])
  },

  down: async (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('users', { email } , {});
  }
};
