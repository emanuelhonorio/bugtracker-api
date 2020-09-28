const Bug = require("../models/bug");
const Yup = require("yup");
const Project = require("../models/project");
const { Op } = require("sequelize");

class BugController {
  async list(req, res, next) {
    const { id: project_id } = req.params;
    const { title, status, severity } = req.query;

    const schema = Yup.object().shape({
      project_id: Yup.number().required(),
      title: Yup.string(),
      status: Yup.mixed().oneOf(["OPEN", "CLOSED", "FIXED"]),
      severity: Yup.mixed().oneOf(["LOW", "MEDIUM", "HIGH", "CRITICAL"]),
    });

    if (!(await schema.isValid({ project_id, title, status, severity }))) {
      return res.status(400).json({ error: "Validation fails" });
    }

    const where = { project_id };

    if (title) {
      where.title = {
        [Op.like]: `%${title}%`,
      };
    }

    if (status) {
      where.status = status;
    }

    if (severity) {
      where.severity = severity;
    }

    try {
      const bugs = await Bug.findAll({ where, order: [["createdAt", "DESC"]] });
      return res.status(200).json(bugs);
    } catch (err) {
      return next(err);
    }
  }

  async store(req, res, next) {
    const { id: project_id } = req.params;
    const { title, description, severity } = req.body;

    const schema = Yup.object().shape({
      title: Yup.string().required(),
      description: Yup.string(),
      severity: Yup.mixed().oneOf(["LOW", "MEDIUM", "HIGH", "CRITICAL"]),
      project_id: Yup.string().required(),
    });

    if (!(await schema.isValid({ title, description, severity, project_id }))) {
      return res.status(400).json({ error: "Validation fails" });
    }

    try {
      const project = await Project.findByPk(project_id);

      if (!project) {
        return res.status(404).json({ error: "project not found" });
      }

      const bug = await Bug.create({
        title,
        description,
        severity,
        project_id,
        created_by: req.userId,
      });
      return res.status(200).json({ bug });
    } catch (err) {
      return next(err);
    }
  }

  async update(req, res, next) {
    const { id } = req.params;

    const { title, description, severity, status } = req.body;

    const schema = Yup.object().shape({
      title: Yup.string(),
      description: Yup.string(),
      severity: Yup.mixed().oneOf(["LOW", "MEDIUM", "HIGH", "CRITICAL"]),
      status: Yup.mixed().oneOf(["OPEN", "CLOSED", "FIXED"]),
    });

    if (!(await schema.isValid({ title, description, severity, status }))) {
      return res.status(400).json({ error: "Validation fails" });
    }

    try {
      const bug = await Bug.findByPk(id);

      if (!bug) {
        return res.status(404).json({ error: "bug not found" });
      }

      const project = await Project.findByPk(bug.project_id);

      if (bug.created_by !== req.userId || project.owner_id !== req.userId) {
        return res.status(403).json({
          error:
            "you need to be either the project owner or the bug creator for this action",
        });
      }

      if (title) bug.title = title;
      if (description) bug.description = description;
      if (severity) bug.severity = severity;
      if (status) bug.status = status;

      return res.status(200).json({ bug: await bug.save() });
    } catch (err) {
      return next(err);
    }
  }

  async delete(req, res, next) {
    const { id } = req.params;

    try {
      const bug = await Bug.findByPk(id);

      if (!bug) {
        return res.status(404).json({ error: "bug not found" });
      }

      const project = await Project.findByPk(bug.project_id);

      if (project.owner_id !== req.userId) {
        return res
          .status(403)
          .json({ error: "you need to be the project owner to delete a bug" });
      }

      await bug.destroy();
      return res.status(204).send();
    } catch (err) {
      return next(err);
    }
  }
}

module.exports = new BugController();
