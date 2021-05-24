// import moment from 'moment'
import Model from "../models/model";
// import districtModel from '../Model/districts'
import models from "../entiny/index";
import _ from "lodash";
// import errorCode from '../utils/errorCode';
import * as ApiErrors from "../error";
import ErrorHelpers from "../helper/errorHelper";

import preCheckHelpers, { TYPE_CHECK } from "../helpers/preCheckHelper";

const { skills } = model;

export default {
 

        const perPage = range[1] - range[0] + 1;
        const page = Math.floor(range[0] / perPage);

        // filterHelpers.makeStringFilterRelatively(["title"], whereFilter);

        if (!whereFilter) {
          whereFilter = { ...filter };
        }

        console.log("where", whereFilter);

        Model.findAndCountAll(skills, {
          where: whereFilter,
          order: [sort],
          offset: range[0],
          limit: perPage,
          //   include: [
          //     {
          //       model: courses,
          //       as: "courses",
          //       required: true,
          //     },
          //   ],
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
              ErrorHelpers.errorReject(err, "getListError", "skillInventory")
            );
          });
          const perPage = range[1] - range[0] + 1;
          const page = Math.floor(range[0] / perPage);
  
          // filterHelpers.makeStringFilterRelatively(["title"], whereFilter);
  
          if (!whereFilter) {
            whereFilter = { ...filter };
          }
  
          console.log("where", whereFilter);
  
          Model.findAndCountAll(skills, {
            where: whereFilter,
            order: [sort],
            offset: range[0],
            limit: perPage,
      } catch (err) {
        reject(ErrorHelpers.errorReject(err, "getListError", "skillinventory"));
      }
    }),
  get_one: (param) =>
    new Promise((resolve, reject) => {
      try {
     
        const id = param.id;

        Model.findOne(skills, {
          where: { id: id },
          attributes: { exclude: ["usersId"] },
        
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
              ErrorHelpers.errorReject(err, "getInfoError", "skillinventory")
            );
          });
      } catch (err) {
        reject(ErrorHelpers.errorReject(err, "getInfoError", "skillinventory"));
      }
    }),
  create: async (param) => {
    let finnalyResult;

    try {
      const entity = param.entity;

      console.log("Model create: ", entity);

 
      finnalyResult = await Model.create(skills, param.entity).catch(
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
      ErrorHelpers.errorThrow(error, "crudError", "skillinventory");
    }

    return { result: finnalyResult };
  },
  update: async (param) => {
    let finnalyResult;

      if (foundTopic) {
       

        await Model.update(skills, entity, {
          where: { id: parseInt(param.id) },
        }).catch((error) => {
          throw new ApiErrors.BaseError({
            statusCode: 202,
            type: "crudError",
            error,
          });
        });

        finnalyResult = await Model.findOne(skills, {
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
        
    try {
        const entity = param.entity;
  
        console.log("Ward update: ", entity);
  
        const foundTopic = await Model.findOne(skills, {
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
  
      } else {
        throw new ApiErrors.BaseError({
          statusCode: 202,
          type: "crudNotExisted",
        });
      }
    } catch (error) {
      ErrorHelpers.errorThrow(error, "crudError", "skillinventory");
    }

    return { result: finnalyResult };
  },
  delete: async (param) => {
    try {
      console.log("delete id", param.id);

      const foundTopic = await Model.findOne(skills, {
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
        await Model.destroy(skills, { where: { id: parseInt(param.id) } });

        const wardAfterDelete = await Model.findOne(skills, {
          where: { Id: param.id },
        }).catch((err) => {
          ErrorHelpers.errorThrow(err, "crudError", "skillinventory");
        });

        if (wardAfterDelete) {
          throw new ApiErrors.BaseError({
            statusCode: 202,
            type: "deleteError",
          });
        }
      }
    } catch (err) {
      ErrorHelpers.errorThrow(err, "crudError", "skillinventory");
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

        Model.findAll(skills, {
          where: filter,
          order: [sort],
          //   include: [
          //     {
          //       model: courses,
          //       as: "courses",
          //       required: true,
          //     },
          //     {
          //       model: weeks,
          //       as: "weeks",
          //       required: true,
          //     },
          //   ],
        })
          .then((result) => {
            // console.log("result: ", result)
            resolve(result);
          })
          .catch((err) => {
            reject(
              ErrorHelpers.errorReject(err, "getListError", "skillinventory")
            );
          });
      } catch (err) {
        reject(ErrorHelpers.errorReject(err, "getListError", "skillinventory"));
      }
    }),
};
