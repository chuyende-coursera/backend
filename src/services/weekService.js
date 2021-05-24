// import moment from 'moment'
import Model from "../models/models";
// import districtModel from '../Model/districts'
import models from "../entity/index";
import _ from "lodash";
// import errorCode from '../utils/errorCode';
import * as ApiErrors from "../errors";
import ErrorHelpers from "../helpers/errorHelpers";
import filterHelpers from "../helpers/filterHelpers";
import preCheckHelpers, { TYPE_CHECK } from "../helpers/preCheckHelpers";

const { courses, weeks, courseWeeks, videoWeek } = models;

export default {
  get_list: (param) =>
    new Promise((resolve, reject) => {
      try {
        const { filter, range, sort } = param;
        let whereFilter = filter;

        console.log(filter);
        try {
          whereFilter = filterHelpers.combineFromDateWithToDate(whereFilter);
        } catch (error) {
          reject(error);
        }

        const perPage = range[1] - range[0] + 1;
        const page = Math.floor(range[0] / perPage);

        filterHelpers.makeStringFilterRelatively(["title"], whereFilter);

        if (!whereFilter) {
          whereFilter = { ...filter };
        }

        Model.findAndCountAll(weeks, {
          where: whereFilter,
          order: [sort, [videoWeek, "orderVideo", "ASC"]],
          offset: range[0],
          limit: perPage,
          include: [
            {
              model: courses,
              required: true,
              as: "courses",
            },
            {
              model: videoWeek,
              as: "videoWeek",
              required: true,
              // where: whereDistrictFilter,
            },
          ],
          // logging: (log) => console.log(log),
        })
          .then((result) => {
            resolve({
              ...result,
              page: page + 1,
              perPage,
            });
          })
          .catch((err) => {
            reject(
              ErrorHelpers.errorReject(err, "getListError", "weekservice")
            );
          });
      } catch (err) {
        reject(ErrorHelpers.errorReject(err, "getListError", "weekservice"));
      }
    }),
  get_one: (param) =>
    new Promise((resolve, reject) => {
      try {
        // console.log("Menu Model param: %o | id: ", param, param.id)
        const id = param.id;

        Model.findOne(weeks, {
          where: { id: id },
          attributes: { exclude: ["usersId"] },
          include: [
            {
              model: courses,
              as: "courses",
              required: true,
            },
            {
              model: videoWeek,
              as: "videoWeek",
              required: true,
              // where: whereDistrictFilter,
            },
          ],
        })
          .then((result) => {
            if (!result) {
              reject(
                new ApiErrors.BaseError({
                  statusCode: 202,
                  type: "crudNotExisted",
                })
              );
            }
            resolve(result);
          })
          .catch((err) => {
            reject(
              ErrorHelpers.errorReject(err, "getInfoError", "weekservice")
            );
          });
      } catch (err) {
        reject(ErrorHelpers.errorReject(err, "getInfoError", "weekservice"));
      }
    }),
  create: async (param) => {
    let finnalyResult;

    try {
      const entity = param.entity;

      const paramWeek = _.omit(entity, ["videoWeeks"]);

      const infoArr = Array.from(
        await Promise.all([
          preCheckHelpers.createPromiseCheckNew(
            Model.findOne(weeks, {
              where: {
                header: paramWeek.header,
                coursesId: paramWeek.coursesId,
              },
            }),

            paramWeek.header ? true : false,
            TYPE_CHECK.CHECK_DUPLICATE,
            { parent: "api.weeks.header" }
          ),
        ])
      );

      if (!preCheckHelpers.check(infoArr)) {
        throw new ApiErrors.BaseError({
          statusCode: 202,
          type: "getInfoError",
          message: "Không xác thực được thông tin gửi lên",
        });
      }

      finnalyResult = await Model.create(weeks, paramWeek).catch((error) => {
        throw new ApiErrors.BaseError({
          statusCode: 202,
          type: "crudError",
          error,
        });
      });

      console.log(finnalyResult);
      if (!finnalyResult) {
        throw new ApiErrors.BaseError({
          statusCode: 202,
          type: "crudInfo",
        });
      } else {
        let paramVideoWeeks = _.pick(entity, ["videoWeeks"]).videoWeeks;

        paramVideoWeeks = paramVideoWeeks.map((e) => {
          return {
            ...e,
            durationVideo: 10,
            weeksId: finnalyResult.id,
          };
        });
        console.log("paramVideoWeeks: ", paramVideoWeeks);
        await Model.bulkCreate(videoWeek, paramVideoWeeks)
          .then((ok1) => {
            console.log(ok1);
            if (!ok1[0].dataValues) {
              throw new ApiErrors.BaseError({
                statusCode: 202,
                type: "crudInfo",
                error,
              });
            }
          })
          .catch((error) => {
            throw new ApiErrors.BaseError({
              statusCode: 202,
              type: "crudInfo",
              error,
            });
          });
      }
    } catch (error) {
      ErrorHelpers.errorThrow(error, "crudError", "weekservice");
    }
    return { result: finnalyResult };
    //
  },
  update: async (param) => {
    let finnalyResult;

    try {
      const entity = param.entity;

      console.log("Ward update: ", entity);

      const foundTopic = await Model.findOne(weeks, {
        where: {
          id: param.id,
        },
      }).catch((error) => {
        throw preCheckHelpers.createErrorCheck(
          {
            typeCheck: TYPE_CHECK.GET_INFO,
            Modeltructure: { parent: "wards" },
          },
          error
        );
      });

      if (foundTopic) {
        // const infoArr = Array.from(
        //   await Promise.all([
        //     preCheckHelpers.createPromiseCheck(
        //       Model.findOne,
        //       {
        //         where: {
        //           id: { $ne: param.id },
        //           name: entity.name || foundTopic.name,
        //           districtsId: entity.districtsId || foundTopic.districtsId,
        //         },
        //       },
        //       entity.name || entity.districtsId ? true : false,
        //       TYPE_CHECK.CHECK_DUPLICATE,
        //       { parent: "api.wards.name" }
        //     ),
        //     // preCheckHelpers.createPromiseCheck(districtModel.findOne,
        //     //   {
        //     //     where: {
        //     //       id: entity.districtsId,
        //     //     }
        //     //   },
        //     //   entity.districtsId ? true : false, TYPE_CHECK.CHECK_EXISTS,
        //     //   { parent: 'districts' }
        //     // )
        //   ])
        // );

        // if (!preCheckHelpers.check(infoArr)) {
        //   throw new ApiErrors.BaseError({
        //     statusCode: 202,
        //     type: "getInfoError",
        //     message: "Không xác thực được thông tin gửi lên",
        //   });
        // }

        await Model.update(weeks, entity, {
          where: { id: parseInt(param.id) },
        }).catch((error) => {
          throw new ApiErrors.BaseError({
            statusCode: 202,
            type: "crudError",
            error,
          });
        });

        finnalyResult = await Model.findOne(weeks, {
          where: { Id: param.id },
        }).catch((error) => {
          throw new ApiErrors.BaseError({
            statusCode: 202,
            type: "crudInfo",
            error,
          });
        });

        if (!finnalyResult) {
          throw new ApiErrors.BaseError({
            statusCode: 202,
            type: "crudInfo",
          });
        }
      } else {
        throw new ApiErrors.BaseError({
          statusCode: 202,
          type: "crudNotExisted",
        });
      }
    } catch (error) {
      ErrorHelpers.errorThrow(error, "crudError", "weekservice");
    }

    return { result: finnalyResult };
  },
  delete: async (param) => {
    try {
      console.log("delete id", param.id);

      const foundTopic = await Model.findOne(weeks, {
        where: {
          id: param.id,
        },
      }).catch((error) => {
        throw new ApiErrors.BaseError({
          statusCode: 202,
          type: "getInfoError",
          message: "Lấy thông tin của địa điểm thất bại!",
          error,
        });
      });

      if (!foundTopic) {
        throw new ApiErrors.BaseError({
          statusCode: 202,
          type: "crudNotExisted",
        });
      } else {
        await Model.destroy(weeks, { where: { id: parseInt(param.id) } });

        const wardAfterDelete = await Model.findOne(weeks, {
          where: { Id: param.id },
        }).catch((err) => {
          ErrorHelpers.errorThrow(err, "crudError", "weekservice");
        });

        if (wardAfterDelete) {
          throw new ApiErrors.BaseError({
            statusCode: 202,
            type: "deleteError",
          });
        }
      }
    } catch (err) {
      ErrorHelpers.errorThrow(err, "crudError", "weekservice");
    }

    return { status: 1 };
  },
  get_all: (param) =>
    new Promise((resolve, reject) => {
      try {
        // console.log("filter:", JSON.parse(param.filter))
        let filter = {};
        let sort = ["id", "DESC"];

        if (param.filter) filter = param.filter;

        if (param.sort) sort = param.sort;

        Model.findAll(weeks, {
          where: filter,
          order: [sort],
        })
          .then((result) => {
            // console.log("result: ", result)
            resolve(result);
          })
          .catch((err) => {
            reject(
              ErrorHelpers.errorReject(err, "getListError", "weekservice")
            );
          });
      } catch (err) {
        reject(ErrorHelpers.errorReject(err, "getListError", "weekservice"));
      }
    }),
};
