import logger from "../utils/logger";
import loggerFormat from "../utils/loggerFormat";
// import LogModel from '../entity/logs';
import config from "../config";

const TYPE = {
  CREATE: 1,
  UPDATE: 2,
  DELETE: 3,
};

export default {
  logInfor: (req, res, logs) => {
    const objLogger = loggerFormat(req, res);

    logger.info("Logs ", {
      ...objLogger,
      // ...logs
    });
  },
  logAxiosInfo: (response) => {
    logger.info("Logs ", {
      ...response,
    });
  },
  logInfo: (req, res, logs) => {
    const objLogger = loggerFormat(req, res);

    logger.info("Logs ", {
      ...objLogger,
      // ...logs
    });
  },
  logError: (req, res, error) => {
    const objLogger = loggerFormat(req, res);

    logger.error("Error", {
      ...objLogger,
      ...error,
    });
  },
  logAxiosError: (error) => {
    // logger.error('Error', {
    //   ...error
    // });
    logger.error("Error", error);
  },
  logUpdate: (req, res, logs) =>
    new Promise((resolve, reject) => {
      const objLogger = loggerFormat(req, res);
      const { /* userId, */ dataBody, dataOutput } = logs;
      const createDate = Date.now();

      if (config.LOGGING_DATA_TO_MONGO === "true") {
        // LogModel.create({
        //   userId: req.auth.userId,
        //   message: objLogger.message,
        //   type: TYPE.UPDATE,
        //   dataBody,
        //   dataOutput: dataOutput.dataValues || dataOutput,
        //   createDate
        // }).then(() => {
        logger.info("Logs ", {
          ...objLogger,
          ...logs,
          insertToDb: {
            success: true,
          },
        });
        resolve();
        // }).catch(error => {
        //   logger.info('Logs ', {
        //     ...objLogger,
        //     ...logs,
        //     insertToDb: {
        //       success: false,
        //       error
        //     }
        //   });
        //   reject(error)
        // });
      } else {
        logger.info("Logs ", {
          ...objLogger,
          ...logs,
          insertToDb: {
            success: null,
          },
        });
        resolve();
      }
    }),
  logCreate: (req, res, logs) =>
    new Promise((resolve, reject) => {
      const objLogger = loggerFormat(req, res);
      const { dataBody, dataOutput } = logs;
      const createDate = Date.now();

      if (config.LOGGING_DATA_TO_MONGO === "true") {
        // LogModel.create({
        //   userId: req.auth.userId,
        //   message: objLogger.message,
        //   type: TYPE.CREATE,
        //   dataBody,
        //   dataOutput: dataOutput.dataValues || dataOutput,
        //   createDate
        // }).then(() => {
        logger.info("Logs ", {
          ...objLogger,
          ...logs,
          insertToDb: {
            success: true,
          },
        });
        resolve();
        // }).catch(error => {
        //   logger.info('Logs ', {
        //     ...objLogger,
        //     ...logs,
        //     insertToDb: {
        //       success: false,
        //       error
        //     }
        //   });
        //   reject(error)
        // });
      } else {
        logger.info("Logs ", {
          ...objLogger,
          ...logs,
          insertToDb: {
            success: null,
          },
        });
        resolve();
      }
    }),
  logDelete: (req, res, logs) =>
    new Promise((resolve, reject) => {
      const objLogger = loggerFormat(req, res);
      const { dataBody, dataOutput } = logs;
      const createDate = Date.now();

      if (config.LOGGING_DATA_TO_MONGO === "true") {
        // LogModel.create({
        //   message: objLogger.message,
        //   type: TYPE.DELETE,
        //   dataBody,
        //   dataOutput: dataOutput.dataValues || dataOutput,
        //   createDate
        // }).then(() => {
        logger.info("Logs ", {
          ...objLogger,
          ...logs,
          insertToDb: {
            success: true,
          },
        });
        resolve();
        // }).catch(error => {
        //   logger.info('Logs ', {
        //     ...objLogger,
        //     ...logs,
        //     insertToDb: {
        //       success: false,
        //       error
        //     }
        //   });
        //   reject(error)
        // });
      } else {
        logger.info("Logs ", {
          ...objLogger,
          ...logs,
          insertToDb: {
            success: null,
          },
        });
        resolve();
      }
    }),
  // logTest: (req, res, logs) => new Promise((resolve, reject) => {
  //   const objLogger = loggerFormat(req, res);
  //   const { /* userId, */ dataQuery } = logs;
  //   const createDate = Date.now();

  //   LogModel.create({
  //     userId: req.auth.userId,
  //     message: objLogger.message,
  //     dataQuery,
  //     createDate
  //   }).then(() => {
  //     logger.info('Logs ', {
  //       ...objLogger,
  //       ...logs,
  //       insertToDb: {
  //         succes: true
  //       }
  //     });
  //     resolve()
  //   }).catch(error => {
  //     logger.info('Logs ', {
  //       ...objLogger,
  //       ...logs,
  //       insertToDb: {
  //         succes: false,
  //         error
  //       }
  //     });
  //     reject(error)
  //   });
  // })
};
