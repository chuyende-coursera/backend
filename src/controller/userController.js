import userService from "../services/userService";
import * as ApiErrors from "../errors";

export default {
  get_list: (req, res, next) => {
    try {
      console.log("res.locals.data: ", res.locals);
      let { sort, range, filter } = res.locals;

      const param = {
        sort,
        range,
        filter,
      };

      userService
        .get_list(param)
        .then((data) => {
          const dataOutput = {
            result: {
              list: data.rows,
              pagination: {
                current: data.page,
                pageSize: data.perPage,
                total: data.count,
              },
            },
            success: true,
            errors: [],
            messages: [],
          };

          res.send(dataOutput);
        })
        .catch((error) => {
          error.dataQuery = req.query;
          next(error);
        });
    } catch (error) {
      error.dataQuery = req.query;
      next(error);
    }
  },

  get_one: (req, res, next) => {
    try {
      const { id } = req.params;
      const param = { id, auth: req.auth };
      userService
        .get_one(param)
        .then((data) => {
          // res.header('Content-Range', `articles ${range}/${data.count}`);
          res.send(data);

          // loggerHelpers.logInfor(req, res, {
          //   dataParam: req.params,
          //   dataQuery: req.query,
          // });
        })
        .catch((err) => {
          next(err);
        });
    } catch (error) {
      next(error);
    }
  },

  find_one: (user) =>
    new Promise((resolve, reject) => {
      try {
        userService
          .find_one(user)
          .then((data) => {
            resolve(data);
          })
          .catch((error) => {
            reject(error);
          });
      } catch (error) {
        reject(error);
      }
    }),

  create: (req, res, next) => {
    try {
      console.log("Request-Body:", res.locals.body);
      const param = {
        entity: res.locals.body,
      };

      userService
        .create(param)
        .then((data) => {
          if (data && data.result) {
            const dataOutput = {
              result: data.result,
              success: true,
              errors: [],
              messages: [],
            };

            res.send(dataOutput);
          } else {
            throw new Error({
              statusCode: 202,
              type: "crudNotExisted",
            });
          }
        })
        .catch((error) => {
          next(error);
        });
    } catch (error) {
      next(error);
    }
  },

  update: (req, res, next) => {
    try {
      const { id } = req.params;
      const entity = res.locals.body;
      // const entity = req.body
      const param = { id, entity, auth: req.auth };

      userService
        .update(param)
        .then((data) => {
          console.log("data: ", data);
          if (data && data.result) {
            const dataOutput = {
              result: data.result,
              success: true,
              errors: [],
              messages: [],
            };

            res.send(dataOutput);

            recordStartTime.call(res);
            loggerHelpers
              .logUpdate(req, res, {
                dataQuery: req.query,
                dataOutput: data.result,
              })
              .catch((error) => console.log(error));
          } else {
            throw new ApiErrors.BaseError({
              statusCode: 202,
              type: "crudNotExisted",
            });
          }
        })
        .catch((error) => {
          error.dataInput = req.body;
          error.dataParams = req.params;
          next(error);
        });
    } catch (error) {
      error.dataInput = req.body;
      error.dataParams = req.params;
      next(error);
    }
  },

  //   changePass: (req, res, next) => {
  //     try {

  //       const { id } = req.params
  //       const entity = req.body
  //       const param = { id, entity }

  //       userService.changePass(param).then(data => {
  //         console.log("changePass dataReturn: ", data)
  //         res.send(data);

  //         // recordStartTime.call(res);
  //         // loggerHelpers.logInfor(req, res, { data });
  //       }).catch(err => {
  //         next(err)
  //       })
  //     } catch (error) {
  //       next(error)
  //     }
  //   },
  //   resetPass: (req, res, next) => {
  //     try {
  //       // recordStartTime.call(req);

  //       const { id } = req.params
  //       const entity = req.body
  //       const param = { id, entity }

  //       userService.resetPass(param).then(data => {
  //         res.send(data);

  //         // recordStartTime.call(res);
  //         // loggerHelpers.logInfor(req, res, { data });
  //       }).catch(err => {
  //         next(err)
  //       })
  //     } catch (error) {
  //       next(error)
  //     }
  //   },
};
