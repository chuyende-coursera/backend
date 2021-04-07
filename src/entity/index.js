import { Sequelize } from 'sequelize';
import { sequelize } from '../db/db';

const models = {};

const modules = [
	require('./users')
]

modules.forEach(module => {
	const model = module(sequelize, Sequelize);

	console.log("model name: ", model.name);

	models[model.name] = model;
})

models.sequelize = sequelize;
models.Sequelize = Sequelize;
models.Op = Sequelize.Op;

export default models;
