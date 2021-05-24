import Promise from "../utils/promise";
import * as ApiErrors from "../errors";

class ModelEntity {
  static count(model, options) {
    return Promise.try(() => {
      return model.count(options);
    }).catch((error) => {
      throw new ApiErrors.BaseError({
        statusCode: 202,
        type: "getListError",
        error,
        name: model.toString() + "Entity",
      });
    });
  }

  static findAndCountAll(model, options) {
    return Promise.try(() => {
      return model.findAndCountAll(options);
    }).catch((error) => {
      throw new ApiErrors.BaseError({
        statusCode: 202,
        type: "getListError",
        error,
        name: model.toString() + "Entity",
      });
    });
  }

  static findOne(model, options) {
    return Promise.try(() => {
      return model.findOne(options);
    }).catch((error) => {
      throw new ApiErrors.BaseError({
        statusCode: 202,
        type: "getListError",
        error,
        name: model.toString() + "Entity",
      });
    });
  }

  static create(model, options) {
    return Promise.try(() => {
      return model.create(options);
    }).catch((error) => {
      console.log(error);

      throw new ApiErrors.BaseError({
        statusCode: 202,
        type: "getListError",
        error,
        name: model.toString() + "Entity",
      });
    });
  }

  static update(model, entity, options) {
    return Promise.try(() => {
      return model.update(entity, options).catch((error) => {
        throw new ApiErrors.BaseError({
          statusCode: 202,
          type: "getListError",
          error,
          name: model.toString() + "Entity",
        });
      });
    });
  }

  static destroy(model, options) {
    return Promise.try(() => {
      return model.destroy(options);
    }).catch((error) => {
      throw new ApiErrors.BaseError({
        statusCode: 202,
        type: "getListError",
        error,
        name: model.toString() + "Entity",
      });
    });
  }

  static findAll(model, options) {
    return Promise.try(() => {
      return model.findAll(options);
    }).catch((error) => {
      throw new ApiErrors.BaseError({
        statusCode: 202,
        type: "getListError",
        error,
        name: model.toString() + "Entity",
      });
    });
  }

  static bulkCreate(model, entity) {
    return Promise.try(() => {
      return model.bulkCreate(entity);
    }).catch((error) => {
      throw new ApiErrors.BaseError({
        statusCode: 202,
        type: "crudError",
        error,
        name: model.toString() + "Entity",
      });
    });
  }
}

export default ModelEntity;
