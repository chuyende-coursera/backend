
import Sequelize from 'sequelize';
import config from './config'


export const { Op } = Sequelize;

const logging = process.env.NODE_ENV !== 'production' && process.env.LOGGING === 'true' ? console.log : false;


const operatorsAliases = {
  $eq: Op.eq,
  $ne: Op.ne,
  $gte: Op.gte,
  $gt: Op.gt,
  $lte: Op.lte,
  $lt: Op.lt,
  $not: Op.not,
  $in: Op.in,
  $notIn: Op.notIn,
  $is: Op.is,
  $like: Op.like,
  $notLike: Op.notLike,
  $iLike: Op.iLike,
  $notILike: Op.notILike,
  $regexp: Op.regexp,
  $notRegexp: Op.notRegexp,
  $iRegexp: Op.iRegexp,
  $notIRegexp: Op.notIRegexp,
  $between: Op.between,
  $notBetween: Op.notBetween,
  $overlap: Op.overlap,
  $contains: Op.contains,
  $contained: Op.contained,
  $adjacent: Op.adjacent,
  $strictLeft: Op.strictLeft,
  $strictRight: Op.strictRight,
  $noExtendRight: Op.noExtendRight,
  $noExtendLeft: Op.noExtendLeft,
  $and: Op.and,
  $or: Op.or,
  $any: Op.any,
  $all: Op.all,
  $values: Op.values,
  $col: Op.col
};


export const sequelize = new Sequelize(process.env.SQL_DATABASE, process.env.SQL_USER, process.env.SQL_PASSWORD, {
    host: process.env.SQL_SERVER,
    port: process.env.SQL_PORT,
    dialect: 'mysql',
    dialectOptions: {
        supportBigNumbers: true,
        bigNumberStrings: true,
        multipleStatements: true,
        // timezone,
        charset: 'utf8_general_ci',
        // dateStrings: false,
        connectTimeout: config.sql.connectionTimeout,
        // typeCast: (field, next) => {
        //   if (field.type === 'DATETIME' || field.type === 'TIMESTAMP') {
        //     // return new Date(field.string() + 'Z');
        //     // console.log(field.string());
        //     // return field.string();
        //     return new Date(field.string());
        //     // return field.string();
        //   }
    
        //   return next();
        // }
        // debug: true
      },
      pool: {
        // max: config.sql.pool.max,
        // min: config.sql.pool.min,
        // acquire: config.sql.connectionTimeout,
        // idle: config.sql.pool.idleTimeoutMillis,
        max: parseInt(config.SQL_POOL_MAX),
        min: parseInt(config.SQL_POOL_MIN),
        acquire: parseInt(config.SQL_POOL_CONNECTION_TIMEOUT) || config.sql.connectionTimeout,
        idle: parseInt(config.SQL_POOL_IDLE_TIMEOUT_MILLIS) || config.sql.pool.idleTimeoutMillis
      },
      define: {
        createdAt: true,
        updatedAt: true,
        underscored: true,
        freezeTableName: false,
        charset: 'utf8',
        dialectOptions: {
          multipleStatements: true,
          charset: 'utf8_general_ci'
        },
        timestamps: false,
        // timezone, // for writng
      },
    //   timezone, // for writng
      logging,
      operatorsAliases
})