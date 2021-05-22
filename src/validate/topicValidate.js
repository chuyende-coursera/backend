import ValidateJoi, { noArguments } from "../utils/validateJoi";
import regexPattern from "../utils/regexPattern";
import viMessage from "../locates/vi";
import { sequelize } from "../db/db";

const DEFAULT_SCHEMA = {
  name: ValidateJoi.createSchemaProp({
    string: noArguments,
    label: viMessage["api.topics.name"],
  }),
  usersId: ValidateJoi.createSchemaProp({
    number: noArguments,
    label: viMessage.usersId,
  }),
  createDate: ValidateJoi.createSchemaProp({
    date: noArguments,
    label: viMessage.createDate,
  }),
  status: ValidateJoi.createSchemaProp({
    boolean: noArguments,
    label: viMessage.status,
  }),
};

export default {
  authenCreate: (req, res, next) => {
    // const usersCreatorId = req.auth.userId;

    const usersId = req.auth.userId;
    const { name, createDate, status } = req.body;
    const topics = {
      name,
      usersId,
      createDate,
      status,
    };

    const SCHEMA = ValidateJoi.assignSchema(DEFAULT_SCHEMA, {
      name: {
        required: noArguments,
        max: 50,
      },
      status: {
        required: noArguments,
      },
      usersId: {
        required: noArguments,
      },
    });

    // console.log('input: ', input);
    ValidateJoi.validate(topics, SCHEMA)
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

    const { name, createDate, status } = req.body;
    const district = { name, createDate, status };

    const SCHEMA = ValidateJoi.assignSchema(DEFAULT_SCHEMA, {
      name: {
        max: 50,
      },
    });

    ValidateJoi.validate(district, SCHEMA)
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
      const { id, name, status, FromDate, ToDate } = JSON.parse(filter);
      const topics = { id, name, status, FromDate, ToDate };

      // console.log(district)
      const SCHEMA = {
        id: ValidateJoi.createSchemaProp({
          string: noArguments,
          label: viMessage["api.topics.id"],
          regex: regexPattern.listIds,
        }),
        ...DEFAULT_SCHEMA,
        FromDate: ValidateJoi.createSchemaProp({
          date: noArguments,
          label: viMessage.FromDate,
        }),
        ToDate: ValidateJoi.createSchemaProp({
          date: noArguments,
          label: viMessage.ToDate,
        }),
      };

      // console.log('input: ', input);
      ValidateJoi.validate(topics, SCHEMA)
        .then((data) => {
          if (id) {
            ValidateJoi.transStringToArray(data, "id");
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
