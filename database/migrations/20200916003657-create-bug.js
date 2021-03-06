"use strict";
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable("bugs", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      title: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      description: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      severity: {
        type: Sequelize.ENUM(["LOW", "MEDIUM", "HIGH", "CRITICAL"]),
        defaultValue: "LOW",
        allowNull: false,
      },
      status: {
        type: Sequelize.ENUM(["OPEN", "CLOSED", "FIXED"]),
        defaultValue: "OPEN",
        allowNull: false,
      },
      project_id: {
        type: Sequelize.INTEGER,
        references: { model: "projects", key: "id" },
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
        allowNull: false,
      },
      created_by: {
        type: Sequelize.INTEGER,
        references: { model: "users", key: "id" },
        onUpdate: "CASCADE",
        onDelete: "SET NULL",
      },
      created_at: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      updated_at: {
        allowNull: false,
        type: Sequelize.DATE,
      },
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable("bugs");
  },
};
