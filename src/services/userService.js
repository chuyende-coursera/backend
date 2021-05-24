import Model from "../models/models";
import _ from "lodash";
import Promise from "../utils/promise";
import ErrorHelpers from "../helpers/errorHelpers";
import { md5 } from "../utils/crypto";
import models from "../entity/index";
import preCheckHelpers, { TYPE_CHECK } from "../helpers/preCheckHelpers";
import filterHelpers from "../helpers/filterHelpers";
import * as ApiErrors from "../errors";

const { users, groupUsers, courses } = models;

export default {
  get_list: async (param) => {
    console.log("param: ", param);
    let finalResult;
    try {
      const { filter, range, sort } = param;
      let whereFilter = _.omit(filter, ["wardsId"]);
      whereFilter = _.assign(whereFilter, { id: { $not: 0 } });
      filterHelpers.makeStringFilterRelatively(["name"], whereFilter);
      console.log("whereFilter: ", whereFilter);
      const perPage = range[1] - range[0] + 1;
      const page = Math.floor(range[0] / perPage);

      const result = await Model.findAndCountAll(users, {
        where: whereFilter,
        order: [sort],
        attributes: {
          exclude: ["password"],
        },
        include: [
          {
            model: groupUsers,
            as: "groupUsers",
          },
          {
            model: courses,
            as: "courses",
          },
        ],
      }).catch((error) => {
        ErrorHelpers.errorThrow(error, "getListError", "UserServices");
      });

      finalResult = {
        ...result,
        page: page + 1,
        perPage,
      };
    } catch (error) {
      ErrorHelpers.errorThrow(error, "getListError", "UserServices");
    }
    return finalResult;
  },

  get_one: async (param) => {
    console.log("param: ", param);
    let finalResult;
    try {
      const { id } = param;

      const whereFilter = { id };

      const result = await Model.findOne(users, {
        where: whereFilter,
        attributes: {
          // include: [],
          exclude: ["password"],
        },
      }).catch((error) => {
        ErrorHelpers.errorThrow(error, "getInfoError", "UserServices");
      });

      finalResult = result;
    } catch (error) {
      ErrorHelpers.errorThrow(error, "getInfoError", "UserServices");
    }
    return finalResult;
  },

  find_one: (param) =>
    new Promise((resolve, reject) => {
      try {
        console.log("param", param);
        Model.findOne(users, {
          where: param,
        })
          .then((result) => {
            resolve(result);
          })
          .catch((error) => {
            reject(error);
          });
      } catch (error) {
        reject(error);
      }
    }),

  create: async (param) => {
    console.log("param: ", param);
    let finalResult;
    try {
      let { entity } = param;

      const passMd5 = md5(entity.password);

      entity = Object.assign(param.entity, { password: passMd5 });
      console.log("entity: ", entity);

      const infoArr = Array.from(
        await Promise.all([
          preCheckHelpers.createPromiseCheckNew(
            Model.findOne(users, {
              where: {
                $or: [
                  {
                    username: {
                      $eq: entity.username,
                    },
                  },
                  {
                    mobile: {
                      $eq: entity.mobile,
                    },
                  },
                  {
                    email: {
                      $eq: entity.email,
                    },
                  },
                ],
              },
            }),

            entity.name && entity.mobile && entity.email ? true : false,
            TYPE_CHECK.CHECK_DUPLICATE,
            { parent: "api.users.username" }
          ),
        ])
      );

      console.log("infoArr: ", infoArr);

      if (!preCheckHelpers.check(infoArr)) {
        throw new ApiErrors.BaseError({
          statusCode: 202,
          type: "getInfoError",
          message: "Không xác thực được thông tin gửi lên",
        });
      }

      finalResult = await Model.create(users, entity).catch((err) => {
        ErrorHelpers.errorThrow(error, "crudError", "UserServices");
      });
    } catch (error) {
      ErrorHelpers.errorThrow(error, "crudError", "UserServices");
    }
    return { result: finalResult };
  },

  update: async (param) => {
    let finalResult;

    try {
      let { entity } = param;

      const foundUser = await Model.findOne(users, {
        where: {
          id: param.id,
        },
      });

      if (foundUser) {
        const infoArr = await Promise.all([
          Model.findOne(users, {
            where: {
              id: { $ne: param.id },
              username: entity.username || foundUser.username,
            },
          }),
        ]);
        if (infoArr[0]) {
          throw new ApiErrors.BaseError({
            statusCode: 202,
            type: "getInfoError",
            message: "Không xác thực được thông tin gửi lên",
          });
        }

        await Model.update(users, entity, {
          where: {
            id: parseInt(param.id),
          },
        }).catch((error) => {
          throw new ApiErrors.BaseError({
            statusCode: 202,
            type: "crudInfo",
            message: "Update không thành công",
            error,
          });
        });

        finalResult = await Model.findOne(users, {
          where: {
            id: parseInt(param.id),
          },
        }).catch((error) => {
          throw error;
        });
        console.log("finalResult: ", finalResult);
        if (!finalResult) {
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
      ErrorHelpers.errorThrow(error, "crudError", "UserServices");
    }
    return { result: finalResult };
  },

  //   changePass: param =>
  //     new Promise((resolve, reject) => {
  //       try {
  //         console.log("change pass: ", param);

  //         let { entity } = param;
  //         let newPassMd5;

  //         if (entity.NewPassWord === undefined || entity.NewPassWord === "") {
  //           reject({ status: 0, message: "Mật khẩu mới không hợp lệ" });
  //         }

  //         if (entity.OldPassWord === undefined || entity.OldPassWord === "") {
  //           reject({ status: 0, message: "Mật khẩu cũ không hợp lệ" });
  //         }

  //         if (
  //           entity.OldPassWord !== undefined &&
  //           entity.NewPassWord !== undefined &&
  //           entity.NewPassWord === entity.OldPassWord
  //         ) {
  //           reject({ status: 0, message: "Mật khẩu mới giống mật khẩu cũ" });
  //         }

  //         const oldPassMd5 = md5(entity.OldPassWord);

  //         const whereUser = { id: param.id, password: oldPassMd5 };

  //         console.log("whereUser Old: ", whereUser);

  //         userModel
  //           .findOne({
  //             where: whereUser
  //           })
  //           .then(user => {
  //             if (user) {
  //               newPassMd5 = md5(entity.NewPassWord);

  //               entity = Object.assign(param.entity, { password: newPassMd5 });

  //               userModel
  //                 .update(entity, {
  //                   where: { id: parseInt(param.id) }
  //                 })
  //                 .then(rowsUpdate => {
  //                   console.log("rowsUpdate: ", rowsUpdate);

  //                   if (rowsUpdate[0] > 0) {
  //                     resolve({ status: 1, message: "Thành Công" });
  //                   } else {
  //                     reject({ status: 0, message: "Thay đổi thất bại" });
  //                   }
  //                 })
  //                 .catch(error => {
  //                   reject(
  //                     ErrorHelpers.errorReject(error, "crudError", "UserServices")
  //                   );
  //                 });
  //             } else {
  //               reject({ status: 0, message: "Mật khẩu cũ không đúng." });
  //             }
  //           })
  //           .catch(error => {
  //             reject(
  //               ErrorHelpers.errorReject(error, "crudError", "UserServices")
  //             );
  //           });
  //       } catch (error) {
  //         reject({ status: 0, message: "Lỗi cơ sở dữ liệu" });
  //       }
  //     }),
  //     resetPass: param =>
  //     new Promise(resolve => {
  //       try {
  //         console.log('param: ', param);
  //         let { entity } = param;

  //         if (entity.password === undefined || entity.password === '') {
  //           resolve({ status: 0, message: 'Mạt khẩu không hợp lệ!' });
  //         }
  //         const passMd5 = md5(entity.password);

  //         console.log('md5: ', passMd5);
  //         entity = Object.assign({}, { password: passMd5 });

  //         userModel
  //           .update(entity, {
  //             where: { id: Number(param.id) }
  //             // fields: ['password']
  //           })
  //           .then(rowsUpdate => {
  //             console.log('rowsUpdate: ', rowsUpdate);
  //             if (rowsUpdate[0] > 0) {
  //               resolve({ status: 1, message: 'Thành Công' });
  //             } else {
  //               resolve({ status: 0, message: 'Mật khẩu cũ giống mật khẩu mới' });
  //             }
  //           })
  //           .catch(err => {
  //             console.log('create user err: ', err);
  //             resolve({ status: -2, message: err.errors.message });
  //           });
  //       } catch (error) {
  //         resolve({ status: -1, message: `Lỗi cơ sở dữ liệu: ${error}` });
  //       }
  //     }),
};
