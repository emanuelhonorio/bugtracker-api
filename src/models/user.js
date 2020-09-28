const { Model, DataTypes } = require("sequelize");
const bcrypt = require("bcryptjs");
const UsersProjects = require("./usersProjects");

class User extends Model {
  static init(sequelize) {
    super.init(
      {
        name: DataTypes.STRING,
        email: DataTypes.STRING,
        image_url: DataTypes.STRING,
        password_hash: DataTypes.STRING,
        password: DataTypes.VIRTUAL,
      },
      {
        sequelize,
        tableName: "users",
        underscored: true,
      }
    );

    this.addHook("beforeSave", async (user) => {
      user.password_hash = undefined;

      if (user.password) {
        user.password_hash = await bcrypt.hash(user.password, 8);
      }
    });
  }

  static associate(models) {
    User.belongsToMany(models.Project, {
      through: UsersProjects,
      as: "projects",
    });
  }
}
module.exports = User;
