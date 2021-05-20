import ValidateJoi, { noArguments } from "../utils/validateJoi";
import regexPattern from "../utils/regexPattern";
import viMessage from "../locates/vi";
import { sequelize } from "../db/db";

const DEFAULT_SCHEMA = {
  name: ValidateJoi.createSchemaProp({
    string: noArguments,
    label: viMessage["api.categories.name"],
  }),
  topicsId: ValidateJoi.createSchemaProp({
    number: noArguments,
    label: viMessage.topicsId,
  }),
};

export default {
  authenCreate: (req, res, next) => {
    // const usersCreatorId = req.auth.userId;
    const { name, topicsId } = req.body;
    const categories = {
      name,
      topicsId,
    };

    const SCHEMA = ValidateJoi.assignSchema(DEFAULT_SCHEMA, {
      name: {
        required: noArguments,
        max: 100,
      },
      topicsId: {
        required: noArguments,
      },
    });

    // console.log('input: ', input);
    ValidateJoi.validate(categories, SCHEMA)
      .then((data) => {
        res.locals.body = data;
        next();
      })
      .catch((error) =>
        next({ ...error, message: "Định dạng gửi đi không đúng" })
      );
  },
  authenUpdate: (req, res, next) => {
    // console.log("validate authenUpdate")

    const { name, topicsId } = req.body;
    const categories = { name, topicsId };

    const SCHEMA = ValidateJoi.assignSchema(DEFAULT_SCHEMA, {
      name: {
        max: 50,
      },
    });

    ValidateJoi.validate(categories, SCHEMA)
      .then((data) => {
        res.locals.body = data;
        next();
      })
      .catch((error) =>
        next({ ...error, message: "Định dạng gửi đi không đúng" })
      );
  },
  authenFilter: (req, res, next) => {
    // console.log("validate authenFilter")
    const { filter, sort, range } = req.query;

    res.locals.sort = sort
      ? JSON.parse(sort).map((e, i) =>
          i === 0 ? sequelize.literal(`\`${e}\``) : e
        )
      : ["id", "asc"];
    res.locals.range = range ? JSON.parse(range) : [0, 49];

    if (filter) {
      const { id, name, topicsId } = JSON.parse(filter);
      const categories = { id, name, topicsId };

      // console.log(district)
      const SCHEMA = {
        id: ValidateJoi.createSchemaProp({
          string: noArguments,
          label: viMessage.categoriesId,
          regex: regexPattern.listIds,
        }),
        ...DEFAULT_SCHEMA,
        topicsId: ValidateJoi.createSchemaProp({
          string: noArguments,
          label: viMessage.topicsId,
          regex: regexPattern.listIds,
        }),
      };

      // console.log('input: ', input);
      ValidateJoi.validate(categories, SCHEMA)
        .then((data) => {
          if (id) {
            ValidateJoi.transStringToArray(data, "id");
          }
          if (topicsId) {
            ValidateJoi.transStringToArray(data, "topicsId");
          }
          res.locals.filter = data;
          // console.log('locals.filter', res.locals.filter);
          next();
        })
        .catch((error) => {
          next({ ...error, message: "Định dạng gửi đi không đúng" });
        });
    } else {
      res.locals.filter = {};
      next();
    }
  },
};
