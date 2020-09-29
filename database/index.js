const mongoose = require("mongoose");
const { Sequelize } = require("sequelize");
const sequelizeConfig = require("../src/config/sequelizeConfig");

const Bug = require("../src/models/bug");
const Invite = require("../src/models/invite");
const Project = require("../src/models/project");
const User = require("../src/models/user");
const UsersProjects = require("../src/models/usersProjects");

const models = [User, UsersProjects, Project, Bug, Invite];

class Database {
  constructor() {
    this.initSequelize();
    this.initMongo();
  }

  initSequelize() {
    this.connection = new Sequelize(sequelizeConfig);

    this.connection.sync().then(
      function () {
        console.log("DB connection sucessful.");
      },
      function (err) {
        console.log("Error on connecion to database: ", err);
      }
    );

    models.map((model) => model.init(this.connection));
    models.map(
      (model) => model.associate && model.associate(this.connection.models)
    );
  }

  initMongo() {
    mongoose.connect(process.env.MONGO_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true,
      useFindAndModify: false,
    });

    this.mongoConnection = mongoose.connection;
    this.mongoConnection.on(
      "error",
      console.error.bind(console, "connection error:")
    );
    this.mongoConnection.once("open", function () {
      console.log("Sucessfully connected to mongodb");
    });
  }
}

module.exports = new Database();
