require("dotenv").config();
const express = require("express");
const morgan = require("morgan");
const helmet = require("helmet");
const cors = require("cors");

const routes = require("./routes");

class App {
  constructor() {
    this.server = express();

    this.middlewares();
    this.routes();
    this.errorHandler();
  }

  middlewares() {
    this.server.use(express.json());
    this.server.use(cors());
    this.server.use(morgan("tiny"));
    this.server.use(helmet());
  }

  routes() {
    this.server.use(routes);
  }

  errorHandler() {
    this.server.use((error, req, res, next) => {
      let message = error.message || "Unkown error";
      return res.status(400).json({ error: message });
    });
  }
}

module.exports = new App().server;
