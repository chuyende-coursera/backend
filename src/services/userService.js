// import userModel from "../models/users";
// import _ from "lodash";
// import Promise from "../utils/promise";
// import ErrorHelpers from "../helpers/errorHelpers";
// import { md5 } from "../utils/crypto";

// export default {
//   get_list: async param => {
//     console.log("param: ", param);
//     let finalResult;
//     try {
//       const { filter, range, sort } = param;
//       let whereFilter = _.omit(filter, ["id"]);

//       const perPage = range[1] - range[0] + 1;
//       const page = Math.floor(range[0] / perPage);

//       const result = await userModel
//         .findAndCountAll({
//           // where: whereFilter,
//           // order: [sort],
//           // offset: range[0],
//           // limit: perPage,
//           attributes: { exclude: ["password"] }
//         })
//         .catch(error => {
//           ErrorHelpers.errorThrow(error, "getListError", "UserServices");
//         });

//       finalResult = {
//         ...result,
//         page: page + 1,
//         perPage
//       };
//     } catch (error) {
//       ErrorHelpers.errorThrow(error, "getListError", "UserServices");
//     }
//     return finalResult;
//   },

//   get_one: async param => {
//     console.log("param: ", param);
//     let finalResult;
//     try {
//       const { id } = param;

//       const whereFilter = { id };


//       const result = await userModel.findOne({
//         where: whereFilter,
//         attributes: {
//           // include: [],
//           exclude: ['password']
//         }
//       }).catch(error => {
//         ErrorHelpers.errorThrow(error, 'getInfoError', 'UserServices');
//       })

//       finalResult = result;

//     } catch (error) {
//       ErrorHelpers.errorThrow(error, 'getInfoError', 'UserServices');
//     }
//     return finalResult;
//   },

//   find_one: param =>
//     new Promise((resolve, reject) => {
//       try {
//         userModel
//           .findOne({
//             where: {
//               username: param.username
//             }
//           })
//           .then(result => {
//             resolve(result);
//           })
//           .catch(error => {
//             reject(error);
//           });
//       } catch (error) {
//         reject(error);
//       }
//     }),

//   create: async param => {
//     console.log("param: ", param);
//     let finalResult;
//     try {
//       let { entity } = param;

//       const passMd5 = md5(entity.password);

//       entity = Object.assign(param.entity, { password: passMd5 });

//       finalResult = await userModel.create(entity).catch(err => {
//         ErrorHelpers.errorThrow(error, "crudError", "UserServices");
//       });
//     } catch (error) {
//       ErrorHelpers.errorThrow(error, "crudError", "UserServices");
//     }
//     return { result: finalResult };
//   },

//   update: async param => {
//     let finalResult;

//     try {
//       let { entity } = param;

//       const foundUser = await userModel.findOne({
//         where: {
//           id: param.id
//         }
//       });

//       if (foundUser) {
//         const infoArr = await Promise.all([
//           userModel.findOne({
//             where: {
//               id: { $ne: param.id },
//               username: entity.username || foundUser.username
//             }
//           })
//         ]);

//         if (infoArr[0]) {
//           throw new ApiErrors.BaseError({
//             statusCode: 202,
//             type: "getInfoError",
//             message: "Không xác thực được thông tin gửi lên"
//           });
//         }

//         await userModel
//           .update(entity, {
//             where: {
//               id: parseInt(param.id)
//             }
//           })
//           .catch(error => {
//             throw new ApiErrors.BaseError({
//               statusCode: 202,
//               type: "crudInfo",
//               message: "Update không thành công",
//               error
//             });
//           });

//         finalResult = await userModel
//           .findOne({
//             where: {
//               id: parseInt(param.id)
//             }
//           })
//           .catch(error => {
//             throw error;
//           });

//         if (!finnalyResult) {
//           throw new ApiErrors.BaseError({
//             statusCode: 202,
//             type: "crudInfo"
//           });
//         }
//       } else {
//         throw new ApiErrors.BaseError({
//           statusCode: 202,
//           type: "crudNotExisted"
//         });
//       }
//     } catch (error) {}
//   },

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
// };
