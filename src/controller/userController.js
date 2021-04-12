import userService from "../services/userService";
import { resolve, reject } from "bluebird";

export default {
  get_list: (req, res, next) => {
    try {
      let { sort, range, filter } = req.param;

      sort = sort ? JSON.parse(sort) : ["id", "asc"];
      range = range ? JSON.parse(range) : [0, 49];
      filter = filter ? JSON.parse(filter) : [0, 49];

      const param = {
        sort,
        range,
        filter
      };

      userService
        .get_list(param)
        .then(data => {
          const dataOutput = {
            result: {
              list: data.rows,
              pagination: {
                current: data.page,
                pageSize: data.perPage,
                total: data.count
              }
            },
            success: true,
            errors: [],
            messages: []
          };

          res.send(dataOutput);
        })
        .catch(error => {
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
      const param = { id, auth: req.auth }
      userService.get_one(param).then(data => {
        // res.header('Content-Range', `articles ${range}/${data.count}`);
        res.send(data);

        // loggerHelpers.logInfor(req, res, {
        //   dataParam: req.params,
        //   dataQuery: req.query,
        // });
      }).catch(err => {
        next(err)
      })
    } catch (error) {
      next(error)
    }
  },

  find_one: user => new Promise((resolve, reject) => {
    try {
      userService.find_one(user)
      .then(data => {
        resolve(data)
      })
      .catch(error => {
        reject(error);
      })
    } catch (error) {
      reject(error);
    }
  }),

  create: (req, res, next) => {
    try {
      console.log("Request-Body:", req.body);
      const param = { 
        entity: req.body
      };

      userService
        .create(param)
        .then(data => {
          if (data && data.result) {
            const dataOutput = {
              result: data.result,
              success: true,
              errors: [],
              messages: []
            };

            res.send(dataOutput);
          } else {
            throw new Error({
              statusCode: 202,
              type: "crudNotExisted"
            });
          }
        })
        .catch(error => {
          next(error);
        });
    } catch (error) {
      next(error);
    }
  },

  changePass: (req, res, next) => {
    try {

      const { id } = req.params
      const entity = req.body
      const param = { id, entity }

      userService.changePass(param).then(data => {
        console.log("changePass dataReturn: ", data)
        res.send(data);

        // recordStartTime.call(res);
        // loggerHelpers.logInfor(req, res, { data });
      }).catch(err => {
        next(err)
      })
    } catch (error) {
      next(error)
    }
  },
  resetPass: (req, res, next) => {
    try {
      // recordStartTime.call(req);

      const { id } = req.params
      const entity = req.body
      const param = { id, entity }

      userService.resetPass(param).then(data => {
        res.send(data);

        // recordStartTime.call(res);
        // loggerHelpers.logInfor(req, res, { data });
      }).catch(err => {
        next(err)
      })
    } catch (error) {
      next(error)
    }
  },
};
