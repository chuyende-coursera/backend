import { Sequelize } from "sequelize";
import { sequelize } from "../db/db";
import associate from "./reference";

const models = {};

const modules = [
  require("./users"),
  require("./topics"),
  require("./categories"),
  require("./courses"),
  require("./courseWeeks"),
  require("./weeks"),
  require("./videoWeek"),
  require("./jobs"),
  require("./languages"),
  require("./skills"),
  require("./userCourse"),
  require("./groupUsers"),
];

// console.log("modules: ", modules);
modules.forEach((module) => {
  const model = module(sequelize, Sequelize);

  console.log("model name: ", model.name);

  models[model.name] = model;
});

associate(models);

models.sequelize = sequelize;
models.Sequelize = Sequelize;
models.Op = Sequelize.Op;

export default models;
