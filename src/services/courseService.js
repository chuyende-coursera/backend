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

const {
  courses,
  weeks,
  users,
  categories,
  topics,
  videoWeek,
  jobs,
  skills,
  languages,
} = models;

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

        console.log("where", whereFilter);

        Model.findAndCountAll(courses, {
          where: whereFilter,
          order: [sort],
          offset: range[0],
          limit: perPage,
          include: [
            {
              model: languages,
              required: true,
              as: "languages",
            },
            {
              model: jobs,
              required: true,
              as: "jobs",
            },
            {
              model: users,
              required: true,
              as: "creators",
            },
            {
              model: skills,
              required: true,
              as: "skills",
            },
            {
              model: weeks,
              as: "weeks",
              include: [
                {
                  model: videoWeek,
                  as: "videoWeek",
                },
              ],
            },
            {
              model: categories,
              as: "categories",
              required: true,
              // where: whereDistrictFilter,
              include: [{ model: topics, as: "topics" }],
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
              ErrorHelpers.errorReject(err, "getListError", "courseservice")
            );
          });
      } catch (err) {
        reject(ErrorHelpers.errorReject(err, "getListError", "courseservice"));
      }
    }),
  get_one: (param) =>
    new Promise((resolve, reject) => {
      try {
        // console.log("Menu Model param: %o | id: ", param, param.id)
        const id = param.id;

        Model.findOne(courses, {
          where: { id: id },
          attributes: { exclude: ["usersId"] },
          include: [
            {
              model: languages,
              required: true,
              as: "languages",
            },
            {
              model: jobs,
              required: true,
              as: "jobs",
            },
            {
              model: users,
              required: true,
              as: "creators",
            },
            {
              model: skills,
              required: true,
              as: "skills",
            },
            {
              model: weeks,
              as: "weeks",
              include: [
                {
                  model: videoWeek,
                  as: "videoWeek",
                },
              ],
            },
            {
              model: categories,
              as: "categories",
              required: true,
              include: [
                {
                  model: topics,
                  as: "topics",
                },
              ],
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
              ErrorHelpers.errorReject(err, "getInfoError", "courseservice")
            );
          });
      } catch (err) {
        reject(ErrorHelpers.errorReject(err, "getInfoError", "courseservice"));
      }
    }),
  create: async (param) => {
    let finnalyResult;

    try {
      const entity = param.entity;

      console.log("Model create: ", entity);

      // const infoArr = Array.from(
      //   await Promise.all([
      //     preCheckHelpers.createPromiseCheck(
      //       Model.findOne,
      //       {
      //         where: {
      //           name: entity.name,
      //           districtsId: entity.districtsId,
      //         },
      //       },
      //       entity.name ? true : false,
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

      finnalyResult = await Model.create(courses, param.entity).catch(
        (error) => {
          throw new ApiErrors.BaseError({
            statusCode: 202,
            type: "crudError",
            error,
          });
        }
      );

      if (!finnalyResult) {
        throw new ApiErrors.BaseError({
          statusCode: 202,
          type: "crudInfo",
        });
      }
    } catch (error) {
      ErrorHelpers.errorThrow(error, "crudError", "courseservice");
    }

    return { result: finnalyResult };
  },
  update: async (param) => {
    let finnalyResult;

    try {
      const entity = param.entity;

      console.log("Ward update: ", entity);

      const foundTopic = await Model.findOne(courses, {
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

        await Model.update(courses, entity, {
          where: { id: parseInt(param.id) },
        }).catch((error) => {
          throw new ApiErrors.BaseError({
            statusCode: 202,
            type: "crudError",
            error,
          });
        });

        finnalyResult = await Model.findOne(courses, {
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
      ErrorHelpers.errorThrow(error, "crudError", "courseservice");
    }

    return { result: finnalyResult };
  },
  delete: async (param) => {
    try {
      const foundTopic = await Model.findOne(courses, {
        where: {
          id: param.id,
        },
      }).catch((error) => {
        throw new ApiErrors.BaseError({
          statusCode: 202,
          type: "getInfoError",
          message: "Lấy khóa học thất bại!",
          error,
        });
      });

      if (!foundTopic) {
        throw new ApiErrors.BaseError({
          statusCode: 202,
          type: "crudNotExisted",
        });
      } else {
        await Model.destroy(courses, { where: { id: parseInt(param.id) } });

        const wardAfterDelete = await Model.findOne(courses, {
          where: { Id: param.id },
        }).catch((err) => {
          ErrorHelpers.errorThrow(err, "crudError", "courseservice");
        });

        if (wardAfterDelete) {
          throw new ApiErrors.BaseError({
            statusCode: 202,
            type: "deleteError",
          });
        }
      }
    } catch (err) {
      ErrorHelpers.errorThrow(err, "crudError", "courseservice");
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

        Model.findAll(courses, {
          where: filter,
          order: [sort],
          include: [
            {
              model: languages,
              required: true,
              as: "languages",
            },
            {
              model: jobs,
              required: true,
              as: "jobs",
            },
            {
              model: skills,
              required: true,
              as: "skills",
            },
            {
              model: weeks,
              as: "weeks",
              include: [
                {
                  model: videoWeek,
                  as: "videoWeek",
                },
              ],
            },
            {
              model: categories,
              as: "categories",
              required: true,
              // where: whereDistrictFilter,
              include: [{ model: topics, as: "topics" }],
            },
          ],
        })
          .then((result) => {
            // console.log("result: ", result)
            resolve(result);
          })
          .catch((err) => {
            reject(
              ErrorHelpers.errorReject(err, "getListError", "courseservice")
            );
          });
      } catch (err) {
        reject(ErrorHelpers.errorReject(err, "getListError", "courseservice"));
      }
    }),
};
