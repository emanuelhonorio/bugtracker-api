const { Model, DataTypes } = require("sequelize");
const UsersProjects = require("./usersProjects");

class Project extends Model {
  static init(sequelize) {
    super.init(
      {
        title: DataTypes.STRING,
        description: DataTypes.STRING,
      },
      {
        sequelize,
        tableName: "projects",
        underscored: true,
      }
    );
  }

  static associate(models) {
    Project.belongsTo(models.User, { foreignKey: "owner_id", as: "owner" });
    Project.belongsToMany(models.User, {
      through: UsersProjects,
      as: "users",
    });
    Project.hasMany(models.Bug, { as: "bugs" });
  }
}
module.exports = Project;
