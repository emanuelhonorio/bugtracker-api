module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn("users", "image_url", {
      type: Sequelize.STRING,
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn("users", "image_url");
  },
};
