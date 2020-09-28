const { Op } = require("sequelize");
const Yup = require("yup");
const Project = require("../models/project");
const User = require("../models/user");

class ProjectController {
  async list(req, res, next) {
    const { title } = req.query;

    const where = {};
    if (title) {
      where.title = {
        [Op.like]: `%${title}%`,
      };
    }

    try {
      // Find all projects of the authenticated user
      let projects = await Project.findAll({
        where,
        order: [["createdAt", "DESC"]],
        include: [
          {
            association: "users",
            through: {
              attributes: [],
            },
          },
          {
            association: "bugs",
            attributes: ["id", "title"],
          },
        ],
      });

      projects = projects.filter((p) =>
        p.users.find((u) => u.id === req.userId)
      );
      return res.status(200).json(projects);
    } catch (err) {
      next(err);
    }
  }

  async findById(req, res, next) {
    const { id } = req.params;

    if (!(await Yup.number().required().isValid(id))) {
      return res.status(400).json({ error: "Validation fails" });
    }

    try {
      const project = await Project.findByPk(id, {
        include: {
          association: "users",
          through: {
            attributes: [],
          },
        },
      });

      if (!project || !project.users.find((u) => u.id === req.userId)) {
        return res.status(204).send();
      }

      return res.status(200).json({ project });
    } catch (err) {
      next(err);
    }
  }

  async store(req, res, next) {
    const { title, description } = req.body;

    /* Validate request properties */
    const schema = Yup.object().shape({
      title: Yup.string().required(),
      description: Yup.string(),
    });

    if (!(await schema.isValid({ title, description }))) {
      return res.status(400).json({ error: "Validation fails" });
    }

    /* Create project */
    try {
      const user = await User.findByPk(req.userId);
      const project = await Project.create({
        title,
        description,
        owner_id: req.userId,
      });

      await project.addUser(user);

      return res.status(200).json({ project });
    } catch (err) {
      next(err);
    }
  }

  async update(req, res, next) {
    const { id } = req.params;
    const { title, description } = req.body;

    const schema = Yup.object().shape({
      title: Yup.string(),
      description: Yup.string(),
    });

    if (!(await schema.isValid({ title, description }))) {
      return res.status(400).json({ error: "Validation fails" });
    }

    try {
      const project = await Project.findByPk(id);

      if (!project) {
        return res.status(404).json({ error: "project not found" });
      }

      if (project.owner_id !== req.userId) {
        return res
          .status(403)
          .json({ error: "you need to be a project owner" });
      }

      if (title) {
        project.title = title;
      }

      if (description) {
        project.description = description;
      }

      return res.status(200).json({ project: await project.save() });
    } catch (err) {
      next(err);
    }
  }

  async delete(req, res, next) {
    const { id } = req.params;

    if (!(await Yup.number().required().isValid(id))) {
      return res.status(400).json({ error: "Validation fails" });
    }

    try {
      const project = await Project.findByPk(id);

      if (!project) {
        return res.status(404).json({ error: "project not found" });
      }

      if (project.owner_id !== req.userId) {
        return res
          .status(403)
          .json({ error: "you need to be a project owner" });
      }

      await project.destroy();
      return res.status(204).send();
    } catch (err) {
      next(err);
    }
  }
}

module.exports = new ProjectController();
