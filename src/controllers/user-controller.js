const Yup = require("yup");
const User = require("../models/user");

class UserController {
  async findByEmail(req, res) {
    const { email } = req.query;
    if (!(await Yup.string().email().required().isValid(email))) {
      return res.status(400).json({ error: "Validation fails" });
    }
    const user = await User.findOne({ where: { email } });
    return res.status(200).json(user);
  }

  async getProfile(req, res, next) {
    try {
      const user = await User.findByPk(req.userId);
      return res.status(200).json({ user });
    } catch (err) {
      next(err);
    }
  }

  async store(req, res, next) {
    const schema = Yup.object().shape({
      name: Yup.string().required(),
      email: Yup.string().email().required(),
      password: Yup.string().required().min(5),
      image_url: Yup.string().url(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: "Validation fails" });
    }

    try {
      const { name, email, password, image_url } = req.body;

      const userWithSameEmail = await User.findOne({ where: { email } });

      if (userWithSameEmail) {
        return res.status(400).json({ error: "Email already in use" });
      }

      const { id } = await User.create({ name, email, password, image_url });
      return res.status(200).json({ user: { id, name, email, image_url } });
    } catch (err) {
      next(err);
    }
  }

  async updateProfile(req, res, next) {
    const { name, image_url } = req.body;

    const schema = Yup.object().shape({
      name: Yup.string(),
      image_url: Yup.string().url(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: "Validation fails" });
    }

    try {
      const user = await User.findByPk(req.userId);

      if (name) user.name = name;
      if (image_url) user.image_url = image_url;

      return res.status(200).json({ user: await user.save() });
    } catch (err) {
      return next(err);
    }
  }
}

module.exports = new UserController();
