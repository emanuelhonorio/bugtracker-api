const { Model, DataTypes } = require("sequelize");

class Bug extends Model {
  static init(sequelize) {
    super.init(
      {
        title: DataTypes.STRING,
        description: DataTypes.STRING,
        severity: DataTypes.ENUM(["LOW", "MEDIUM", "HIGH", "CRITICAL"]),
        status: DataTypes.ENUM(["OPEN", "CLOSED", "FIXED"]),
      },
      {
        sequelize,
        tableName: "bugs",
        underscored: true,
      }
    );
  }

  static associate(models) {
    Bug.belongsTo(models.Project, {
      foreignKey: "project_id",
      targetKey: "id",
      as: "project",
    });
    Bug.belongsTo(models.User, {
      foreignKey: "created_by",
      as: "created_by_user",
    });
  }
}

module.exports = Bug;
