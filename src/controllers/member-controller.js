const User = require("../models/user");
const Yup = require("yup");
const Project = require("../models/project");
const Notification = require("../schemas/notification");

class MemberController {
  async list(req, res, next) {
    const { id } = req.params;

    if (!(await Yup.number().required().isValid(id))) {
      return res.status(400).json({ error: "Validation Fails" });
    }

    try {
      const users = await User.findAll({
        include: {
          association: "projects",
          through: { where: { project_id: id }, attributes: [] },
        },
      });

      return res.status(200).json(users.filter((u) => u.projects.length > 0));
    } catch (err) {
      next(err);
    }
  }

  async delete(req, res, next) {
    let { project_id, member_id } = req.params;

    const schema = Yup.object().shape({
      project_id: Yup.number().required(),
      member_id: Yup.number().required(),
    });

    project_id = +project_id;
    member_id = +member_id;

    if (!(await schema.isValid({ project_id, member_id }))) {
      return res.status(400).json({ error: "Validation fails" });
    }

    try {
      // A - Find project and include users
      const project = await Project.findByPk(project_id, {
        include: { association: "users", through: { attributes: [] } },
      });

      // B - check if project exists
      if (!project) {
        return res.status(404).json({ error: "project not found" });
      }

      // C - check if authenticated user is the project owner
      if (project.owner_id !== req.userId) {
        return res.status(403).json({ error: "You must be the project owner" });
      }

      // D - check if member_id is a member
      if (
        !project.users.find(
          (u) => u.id === member_id && u.id !== project.owner_id
        )
      ) {
        return res
          .status(403)
          .json({ error: "User is not a removable member" });
      }

      // E - delete member from project
      const member = await User.findByPk(member_id);
      await project.removeUser(member);

      Notification.create({
        user_id: member_id,
        text: `You have been kicked from project **${project.title}**`,
      });

      return res.status(204).send();
    } catch (err) {
      next(err);
    }
  }
}

module.exports = new MemberController();
