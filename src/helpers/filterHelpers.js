/* eslint-disable require-jsdoc */
import models from "../entity/index";
// import placesUsersModel from "../models/placeUsers";
// import userModel from '../models/users';
import _ from "lodash";
import * as ApiErrors from "../errors";
import ErrorHelpers from "./errorHelpers";
import PreCheckHelpers from "./preCheckHelpers";

const { sequelize, Op } = models;

const GROUP_ADMINSTRATOR = 1;
const GROUP_ADMINSTRATOR_DRUG = 4;
const GROUP_ADMINSTRATOR_DRUGSTORE = 2;
const GROUP_EMPLOYEES_DRUGSTORE = 3;
const GROUP_ADMINSTRATOR_CLINIC = 5;
const GROUP_EMPLOYEES_CLINIC = 6;
const GROUP_DOCTOR_CLINIC = 7;

/**
 *
 * @param {*} input
 */
function getAuthPlaces(input) {
  let placesId = "0";
  let places = [];

  if (input) {
    let inputPlacesId = input.placesId && _.cloneDeep(input.placesId);
    const inputUserInfo = input.userInfo && _.cloneDeep(input.userInfo);

    const arrayPlacesIdOfUser =
      (inputUserInfo &&
        inputUserInfo.places &&
        inputUserInfo.places.map((e) => Number(e.id))) ||
      [];
    const arrayPlacesOfUser =
      (inputUserInfo &&
        inputUserInfo.places &&
        inputUserInfo.places.map((e) => e.dataValues)) ||
      [];

    let arrayAuthPlaces = [];
    let arrayAuthPlacesId = [];

    if (inputPlacesId) {
      if (typeof inputPlacesId === "string")
        inputPlacesId = inputPlacesId.split(",");

      inputPlacesId =
        inputPlacesId["$in"] ||
        _.concat([], inputPlacesId).map((e) => parseInt(e));

      arrayAuthPlacesId = _.intersection(arrayPlacesIdOfUser, inputPlacesId);

      arrayAuthPlaces = _.intersectionBy(
        arrayPlacesOfUser.map((e) => ({ ...e, id: parseInt(e.id) })),
        arrayAuthPlacesId.map((e) => ({ id: e })),
        "id"
      );

      if (arrayAuthPlacesId.length > 0) {
        placesId = { $in: arrayAuthPlacesId };
        places = arrayAuthPlaces;
      } else {
        placesId = "0";
        places = [];
      }
      // else {
      //   // return whereFilter;
      //   throw new ApiErrors.BaseError({
      //     statusCode: 202,
      //     message: 'Bạn không có quyền đối với nội dung này'
      //   });
      // }

      console.log("inputPlacesId:", inputPlacesId);
      console.log("arrayPlacesIdOfUser:", arrayPlacesIdOfUser);
      console.log("arrayAuthPlacesId:", arrayAuthPlacesId);
      console.log("arrayAuthPlaces:", arrayAuthPlaces);
    } else {
      if (arrayPlacesIdOfUser.length > 0) {
        placesId = { $in: arrayPlacesIdOfUser };
        places = arrayPlacesOfUser;
      } else {
        placesId = "0";
        places = [];
      }
    }
  }

  return { placesId, places };
}

/**
 *
 * @param {*} auth
 */
async function findPlacesIdOfUsers(auth) {
  const placesUsers = await placesUsersModel.findAll({
    where: {
      usersId: auth.userId,
    },
  });

  return placesUsers.map((e) => parseInt(e.dataValues.placesId)) || [];
}

/**
 *
 * @param {*} model
 * @param {*} where
 */
// eslint-disable-next-line no-unused-vars
function createIncludeNestedWithWere(model, where) {
  if (model.length === 0) return;

  if (model.length === 1)
    return [
      {
        ...model.shift(),
        required: true,
        where,
      },
    ];

  return [
    {
      ...model.shift(),
      required: true,
      include: createIncludeNestedWithWere(model, where),
    },
  ];
}

/**
 *
 * @param {*} model
 */
// eslint-disable-next-line no-unused-vars
function createIncludeNested(model) {
  if (model.length === 1)
    return [
      {
        ...model.shift(),
      },
    ];

  return [
    {
      ...model.shift(),
      include: createIncludeNested(model),
    },
  ];
}

export default {
  makeOrderWithAssociated: (sort, prefix) => {
    const order = _.cloneDeep(sort).map((e) => {
      if (e[0].split) {
        const listModel = e[0].split(".");
        const field = listModel.splice(listModel.length - 1, 1);

        // const normalField = ['usersCreator']
        // console.log(listModel);

        // console.log(prefix);

        if (prefix === undefined) {
          return [
            ...listModel.map((model) => {
              if (model.indexOf("users") !== -1)
                return { model: models.users, as: model };

              return {
                model:
                  models[
                    "med" + model.charAt(0).toUpperCase() + model.slice(1)
                  ],
                as: model.replace(/^(med)||(clinic)||(vaccination)/, ""),
              };
            }),
            ...field,
            e[1],
          ];
        } else {
          return [
            ...listModel.map((model) => {
              if (model.indexOf("users") !== -1)
                return { model: models.users, as: model };

              const name = model.replace(/^(med)||(clinic)||(vaccination)/, "");

              return {
                model: models[model],
                as: name.charAt(0).toLowerCase() + name.slice(1),
              };
            }),
            ...field,
            e[1],
          ];
        }
      }

      return e;
    });

    console.log(order);

    return order;
  },
  combineFromDateWithToDate: (filter, option, field) => {
    let whereFilter = _.assign({}, filter);

    option = option || "createDate";

    (field && field.length > 0) || (field = ["FromDate", "ToDate"]);

    // console.log(field);

    if (filter[field[0]] && filter[field[1]]) {
      const fromDate = new Date(filter[field[0]]);
      const toDate = new Date(filter[field[1]]);

      // console.log(fromDate.toISOString());
      // console.log(toDate.toISOString());

      if (fromDate > toDate) {
        throw new ApiErrors.BaseError({
          statusCode: 202,
          type: "getListError",
          name: "filter Date Error",
          message: "Ngày bắt đầu lớn hơn ngày kết thúc",
        });
      }
      whereFilter = _.omit(filter, field);
      const fromtoDateFilter = _.assign(
        {},
        {
          [option]: {
            [Op.between]: [fromDate.toISOString(), toDate.toISOString()],
          },
        }
      );

      whereFilter = _.assign(whereFilter, fromtoDateFilter);

      // if (filter[field[0]] > filter[field[1]]) {
      //   throw new ApiErrors.BaseError({
      //     statusCode: 202,
      //     type: 'getListError',
      //     name: 'filter Date Error',
      //     message: 'Ngày bắt đầu lớn hơn ngày kết thúc'
      //   });
      // }
      // whereFilter = _.omit(filter, field);
      // const fromtoDateFilter = _.assign({}, { [option]: { [Op.between]: [filter[field[0]], filter[field[1]]] } });

      // whereFilter = _.assign(whereFilter, fromtoDateFilter);
    } else {
      if (filter[field[0]]) {
        const fromDate = new Date(filter[field[0]]);

        whereFilter = _.omit(filter, [field[0]]);
        const fromtoDateFilter = _.assign(
          {},
          { [option]: { [Op.gte]: fromDate.toUTCString() } }
        );
        // const fromtoDateFilter = _.assign({}, { [option]: { [Op.gte]: filter[field[0]] } });

        whereFilter = _.assign(whereFilter, fromtoDateFilter);
      }
      if (filter[field[1]]) {
        const toDate = new Date(filter[field[1]]);

        whereFilter = _.omit(filter, [field[1]]);
        const fromtoDateFilter = _.assign(
          {},
          { [option]: { [Op.lte]: toDate.toISOString() } }
        );
        // const fromtoDateFilter = _.assign({}, { [option]: { [Op.lte]: filter[field[1]] } });

        whereFilter = _.assign(whereFilter, fromtoDateFilter);
      }
    }

    console.log(whereFilter);

    return whereFilter;
  },
  makeStringFilterRelatively: (keys, filter) => {
    const keysFilter = _.pick(filter, keys);

    keys.forEach((key) => {
      let keyword = keysFilter[key];

      if (new RegExp(/[^A-Za-z0-9]/).test(keyword))
        keyword = keyword
          .split("")
          .map((e) => (new RegExp(/[^A-Za-z0-9]/).test(e) ? "\\" + e : e))
          .join("");

      if (keysFilter[key]) {
        keysFilter[key] = {
          $like: sequelize.literal(`CONCAT('%','${keyword}','%')`),
        };
      }
    });

    filter = _.assign(filter, keysFilter);

    return filter;
  },
  createIncludeWithAuthorization: async (auth, structure, option) => {
    const key = option || "placesId";
    const userInfo = await PreCheckHelpers.getInfoUser(auth).catch((error) => {
      ErrorHelpers.errorThrow(error, "permisionInfoError", "Login", 202);
    });

    if (!userInfo) {
      ErrorHelpers.errorThrow(null, "userNotFoundError", "Login", 202);
    }

    const { groupUserId } = userInfo;
    const placesId = userInfo.places.map((e) => Number(e.id));

    switch (Number(groupUserId)) {
      case GROUP_ADMINSTRATOR:
      case GROUP_ADMINSTRATOR_DRUG:
        return structure.map((e) => {
          return createIncludeNested(e)[0];
        });
      case GROUP_ADMINSTRATOR_DRUGSTORE:
      case GROUP_ADMINSTRATOR_CLINIC:
        // eslint-disable-next-line no-case-declarations
        // console.log('placesId: ', placesId);
        // console.log('key: ', key);
        // eslint-disable-next-line no-case-declarations
        const where = placesId ? { [key]: { $in: placesId } } : {};

        /**
         * @input [structure] Array
         * ex:[
                [{
                  model: sites,
                  as: 'sites',
                }],
                [{
                  model: users,
                  as: 'usersCreator',
                }],
              ]
         * @input [option] String - is a key in where authorization
         * ex: 'placesId' or 'id'
         * @output [include] Array
         * ex:[
                 {
                  model: sites,
                  as: 'sites',
                  where: {
                    placesId: {
                      "$in": [1,2,3]
                    }
                  },
                  {
                    model: users,
                    as: 'users'
                  }
                }
              ]
         */

        return structure.map((e, i) =>
          i !== 0 ? { ...e[0] } : createIncludeNestedWithWere(e, where)[0]
        );
      case GROUP_EMPLOYEES_DRUGSTORE:
      case GROUP_EMPLOYEES_CLINIC:
      case GROUP_DOCTOR_CLINIC:
        return structure.map((e, i) =>
          i !== 1
            ? { ...e[0] }
            : {
                ...e.shift(),
                where: {
                  $or: [
                    {
                      id: auth.userId,
                    },
                    {
                      parentId: auth.userId,
                    },
                  ],
                },
              }
        );
      default:
        throw new ApiErrors.BaseError({
          statusCode: 202,
          message: "Bạn không có quyền đối với nội dung này",
        });
    }
  },
  createIncludeForInnerJoin: (structure) => {
    return structure.map((e) => {
      return createIncludeNested(e)[0];
    });
  },
  getInfoAuthorization: async (auth, info, isPlaceOnly, url) => {
    /**
     * @param auth [Object] - JWT decode -> include: userId
     * @param info [Object] - include: placesId if specify, userParentId
     * @param isPlaceOnly[boolean] - true if GROUP_EMPLOYEES_DRUGSTORE and GROUP_ADMINSTRATOR_DRUG is the same acces resource
     * @return [Object] - list placesId, userParentId, placesInfomation of auth.userId
     */

    let { placesId, userParentId } = info;

    // console.log(placesId);

    /**
     * @summary Get information of User
     */
    const userInfo = await PreCheckHelpers.getInfoUser(auth).catch((error) => {
      ErrorHelpers.errorThrow(error, "permisionInfoError", "Login", 202);
    });

    if (!userInfo) {
      ErrorHelpers.errorThrow(null, "userNotFoundError", "Login", 202);
    }

    /**
     * @summary combine arguments placesId with userInfo above
     */
    const { groupUserId } = userInfo;
    let { isLienThong } = userInfo;
    const placesIds = userInfo.places.map((e) => Number(e.id));
    let placesResultInfo = userInfo.places.map((e) => e.dataValues);
    let placesInfo = [];
    let authPlacesId = [];

    if (url && url === "/api/c/medicines") {
      isLienThong = true;
    }

    if (placesId) {
      // console.log(placesId);
      let inPlacesIds = _.cloneDeep(placesId);

      if (typeof placesId === "string") inPlacesIds = placesId.split(",");

      inPlacesIds =
        placesId["$in"] || _.concat([], inPlacesIds).map((e) => parseInt(e));
      authPlacesId = _.intersection(placesIds, inPlacesIds);

      placesResultInfo = _.intersectionBy(
        placesResultInfo.map((e) => ({ ...e, id: parseInt(e.id) })),
        authPlacesId.map((e) => ({ id: e })),
        "id"
      );

      // console.log("placesIds:", placesIds);
      // console.log("placesId:", placesId);
      // console.log("inPlacesIds:", inPlacesIds);
      // console.log("intersection:", authPlacesId);
    }

    /**
     * @summary if isLienThong is true then return information of places of this user for calling API duocquocgia
     */
    if (isLienThong) placesInfo = placesResultInfo;

    switch (Number(groupUserId)) {
      case GROUP_ADMINSTRATOR:
        // console.log("this");
        break;
      case GROUP_ADMINSTRATOR_DRUG:
        // placesInfo = placesResultInfo;
        break;
      case GROUP_EMPLOYEES_DRUGSTORE:
      // case GROUP_EMPLOYEES_CLINIC:
      // eslint-disable-next-line no-fallthrough
      case GROUP_DOCTOR_CLINIC:
        if (!isPlaceOnly) userParentId = auth.userId;

      // eslint-disable-next-line no-fallthrough
      case GROUP_EMPLOYEES_CLINIC:
      case GROUP_ADMINSTRATOR_DRUGSTORE:
      case GROUP_ADMINSTRATOR_CLINIC:
        // eslint-disable-next-line no-case-declarations
        if (placesId) {
          // let inPlacesIds = placesId;
          // console.log("???")
          // if (typeof placesId === 'string') inPlacesIds = placesId.split(',');

          // inPlacesIds = placesId['$in'] || _.concat([], inPlacesIds).map(e => parseInt(e));
          // const authPlacesId = _.intersection(placesIds, inPlacesIds);

          // placesInfo = _.intersectionBy(placesInfo, authPlacesId.map(e => ({ id: e })), 'id');

          if (authPlacesId.length > 0) {
            placesId = { $in: authPlacesId };
          } else {
            placesId = "0";
          }
          // else {
          //   // return whereFilter;
          //   throw new ApiErrors.BaseError({
          //     statusCode: 202,
          //     message: 'Bạn không có quyền đối với nội dung này'
          //   });
          // }
        } else {
          placesId = placesIds ? { $in: placesIds } : "0";
        }
        // console.log("as", placesIds);

        break;

      default:
        throw new ApiErrors.BaseError({
          statusCode: 202,
          message: "Bạn không có quyền đối với nội dung này",
        });
    }

    // console.log(placesId," ---", userParentId);
    // console.log(placesInfo);

    return { placesId, userParentId, placesInfo };
  },
  getInfoAccessResource: async (auth, inputInfo, isPlaceOnly) => {
    /**
     * @param auth [Object] - JWT decode -> include: userId
     * @param inputInfo [Object] - include: placesId if specify, userParentId
     * @param isPlaceOnly[boolean] - true if GROUP_EMPLOYEES_DRUGSTORE and GROUP_ADMINSTRATOR_DRUG is the same acces resource
     * @return [Object] - list placesId, userParentId, placesInfomation of auth.userId
     */

    /**
     * @summary Get information of User
     */
    const userInfo = await PreCheckHelpers.getInfoUser(auth).catch((error) => {
      ErrorHelpers.errorThrow(error, "permisionInfoError", "Login", 202);
    });

    if (!userInfo) {
      ErrorHelpers.errorThrow(null, "userNotFoundError", "Login", 202);
    }

    /**
     * @summary combine arguments placesId with userInfo above
     */
    const { groupUserId, isLienThong } = userInfo;
    const authInfo = {};
    const authPlaces = getAuthPlaces({
      placesId: inputInfo.placesId,
      userInfo,
    });

    /**
     * @summary if isLienThong is true then return information of places of this user for calling API duocquocgia
     */
    if (isLienThong) authInfo.places = authPlaces.places;

    switch (Number(groupUserId)) {
      case GROUP_ADMINSTRATOR:
        // console.log("this");
        break;
      case GROUP_ADMINSTRATOR_DRUG:
        // placesInfo = placesResultInfo;
        break;
      case GROUP_EMPLOYEES_DRUGSTORE:
        if (!isPlaceOnly) {
          authInfo.users = {
            usersParentId: auth.userId,
            usersCreatorId: auth.userId,
          };
        }
        authInfo.placesId = authPlaces.placesId;
        break;
      case GROUP_EMPLOYEES_CLINIC:
        if (!isPlaceOnly) {
          authInfo.users = {
            usersParentId: auth.userId,
            usersCreatorId: auth.userId,
            groupUserId: 7,
          };
        }
        authInfo.placesId = authPlaces.placesId;
        break;
      case GROUP_DOCTOR_CLINIC:
        if (!isPlaceOnly) {
          authInfo.users = {
            usersParentId: auth.userId,
            usersCreatorId: auth.userId,
            groupUserId: 7,
          };
        }
        authInfo.placesId = authPlaces.placesId;
        break;
      case GROUP_ADMINSTRATOR_DRUGSTORE:
        authInfo.placesId = authPlaces.placesId;
        break;
      case GROUP_ADMINSTRATOR_CLINIC:
        authInfo.placesId = authPlaces.placesId;
        break;
      default:
        throw new ApiErrors.BaseError({
          statusCode: 202,
          message: "Bạn không có quyền đối với nội dung này",
        });
    }

    // console.log(placesId," ---", userParentId);
    // console.log(placesInfo);
    // console.log(JSON.stringify(authInfo))

    return { authInfo, userInfo };
  },
  createWhereWithAuthorization: async (auth, whereFilter) => {
    const { placesId } = whereFilter;

    const userInfo = await PreCheckHelpers.getInfoUser(auth).catch((error) => {
      ErrorHelpers.errorThrow(error, "permisionInfoError", "Login", 202);
    });

    if (!userInfo) {
      ErrorHelpers.errorThrow(null, "userNotFoundError", "Login", 202);
    }

    const { groupUserId } = userInfo;
    const placesIds = userInfo.places.map((e) => Number(e.id));

    switch (Number(groupUserId)) {
      case GROUP_ADMINSTRATOR:
      case GROUP_ADMINSTRATOR_DRUG:
        return whereFilter;
      case GROUP_EMPLOYEES_DRUGSTORE:
      case GROUP_EMPLOYEES_CLINIC:
      case GROUP_DOCTOR_CLINIC:
      // eslint-disable-next-line no-fallthrough
      case GROUP_ADMINSTRATOR_DRUGSTORE:
      case GROUP_ADMINSTRATOR_CLINIC:
        // eslint-disable-next-line no-case-declarations
        // console.log("placesId:", placesId);

        if (placesId) {
          let inPlacesIds = placesId;

          if (typeof placesId === "string") inPlacesIds = placesId.split(",");

          inPlacesIds =
            placesId["$in"] ||
            _.concat([], inPlacesIds).map((e) => parseInt(e));
          const authPlacesId = _.intersection(placesIds, inPlacesIds);

          // console.log("placesIds:", placesIds);
          // console.log("placesId:", placesId);
          // console.log("inPlacesIds:", inPlacesIds);
          console.log("intersection:", authPlacesId);

          if (authPlacesId.length > 0) {
            return _.assign(whereFilter, { placesId: { $in: authPlacesId } });
          }

          // return whereFilter;
          throw new ApiErrors.BaseError({
            statusCode: 202,
            message: "Bạn không có quyền đối với nội dung này",
          });
        }

        // eslint-disable-next-line no-case-declarations
        const wherePermision = placesIds
          ? { placesId: { $in: placesIds } }
          : {};
        // const wherePermision = placesId ? { placesId: { "$in": placesId } } : {};

        return _.assign(whereFilter, wherePermision);
      default:
        throw new ApiErrors.BaseError({
          statusCode: 202,
          message: "Bạn không có quyền đối với nội dung này",
        });
    }
  },
  // findPlacesIdOfUsers
  paginationOfSchema: (range) => {
    const perPage = range[1] - range[0] + 1;
    const page = Math.floor(range[0] / perPage);

    return {
      perPage,
      page,
    };
  },
};
