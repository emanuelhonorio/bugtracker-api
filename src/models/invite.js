const { Model, DataTypes } = require("sequelize");

class Invite extends Model {
  static init(sequelize) {
    super.init(
      {
        status: DataTypes.ENUM(["PENDING", "ACCEPTED", "DECLINED"]),
      },
      {
        sequelize,
        tableName: "invites",
        underscored: true,
      }
    );
  }

  static associate(models) {
    Invite.belongsTo(models.User, { foreignKey: "to", as: "to_user" });
    Invite.belongsTo(models.User, { foreignKey: "by", as: "by_user" });
    Invite.belongsTo(models.Project, {
      foreignKey: "project_id",
      as: "project",
    });
  }
}
module.exports = Invite;
