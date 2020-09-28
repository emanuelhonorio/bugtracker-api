const jwt = require("jsonwebtoken");
const jwtConfig = require("../config/jwtConfig");
const { promisify } = require("util");

module.exports = async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res
      .status(403)
      .json({ error: "Authorization header has not been provided" });
  }

  const parts = authHeader.split(" ");

  if (parts.length !== 2) {
    return res
      .status(403)
      .json({ error: "Bearer or token has not been provided" });
  }

  const [bearer, token] = parts;

  if (!bearer.toLowerCase().startsWith("bearer")) {
    return res.status(403).json({ error: "Invalid token format" });
  }

  // Check actual token
  try {
    const decoded = await promisify(jwt.verify)(token, jwtConfig.secret);

    req.userId = decoded.id;
    next();
  } catch (err) {
    next(err);
  }
};
