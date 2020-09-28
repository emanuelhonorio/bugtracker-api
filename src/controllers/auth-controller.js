const User = require("../models/user");
const Yup = require("yup");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const jwtConfig = require("../config/jwtConfig");

class AuthController {
  async authenticate(req, res, next) {
    const { email, password } = req.body;

    /* Validating request */
    const schema = Yup.object().shape({
      email: Yup.string().email().required(),
      password: Yup.string().required(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: "Validation fails" });
    }

    /* Validating user */
    const user = await User.findOne({ where: { email } });

    if (!user) {
      return res.status(401).json({ error: "Invalid email" });
    }

    if (!(await bcrypt.compare(password, user.password_hash))) {
      return res.status(401).json({ error: "Invalid password" });
    }

    try {
      const token = await jwt.sign({ id: user.id }, jwtConfig.secret, {
        expiresIn: jwtConfig.expiresIn,
      });

      return res.status(200).json({
        user: {
          id: user.id,
          name: user.name,
          email,
          image_url: user.image_url,
        },
        access_token: token,
      });
    } catch (err) {
      next(err);
    }
  }
}

module.exports = new AuthController();
