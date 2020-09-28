const { Model, DataTypes } = require("sequelize");

class UsersProjects extends Model {
  static init(sequelize) {
    super.init(
      {
        user_id: {
          type: DataTypes.INTEGER,
        },
        project_id: {
          type: DataTypes.INTEGER,
        },
      },
      {
        sequelize,
        tableName: "users_projects",
        underscored: true,
      }
    );
  }
}
module.exports = UsersProjects;
