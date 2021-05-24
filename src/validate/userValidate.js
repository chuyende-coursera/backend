import ValidateJoi, { noArguments } from "../utils/validateJoi";
import viMessage from "../locates/vi";
import { sequelize } from "../db/db";
import regexPattern from "../utils/regexPattern";

const DEFAULT_SCHEMA = {
  username: ValidateJoi.createSchemaProp({
    string: noArguments,
    label: viMessage["api.users.username"],
  }),
  password: ValidateJoi.createSchemaProp({
    string: noArguments,
    label: viMessage["api.users.password"],
  }),
  name: ValidateJoi.createSchemaProp({
    string: noArguments,
    label: viMessage["api.users.name"],
  }),
  email: ValidateJoi.createSchemaProp({
    string: noArguments,
    label: viMessage["api.users.email"],
    allow: ["", null],
  }),
  mobile: ValidateJoi.createSchemaProp({
    string: noArguments,
    label: viMessage["api.users.mobile"],
  }),
  wardsId: ValidateJoi.createSchemaProp({
    number: noArguments,
    label: viMessage.wardsId,
    integer: noArguments,
  }),
  groupUsersId: ValidateJoi.createSchemaProp({
    number: noArguments,
    label: viMessage.groupUsersId,
    integer: noArguments,
  }),
  status: ValidateJoi.createSchemaProp({
    boolean: noArguments,
    label: viMessage.status,
  }),
  //   createDate: ValidateJoi.createSchemaProp({
  //     date: noArguments,
  //     label: viMessage.createDate
  //   })
};

export default {
  authenCreate: (req, res, next) => {
    console.log("Validate Create");

    const {
      username,
      password,
      name,
      email,
      mobile,
      wardsId,
      status,
    } = req.body;
    const user = { username, password, email, name, mobile, wardsId, status };

    const SCHEMA = ValidateJoi.assignSchema(DEFAULT_SCHEMA, {
      username: {
        regex: /\w/i,
        max: 50,
        required: noArguments,
      },
      password: {
        min: 6,
        max: 100,
        required: noArguments,
      },
      wardsId: {
        required: noArguments,
      },
      name: {
        max: 100,
        required: noArguments,
      },
      email: {
        regex: regexPattern.email,
        max: 100,
      },
      mobile: {
        regex: regexPattern.phoneNumberVie,
        max: 12,
      },
      wardsId: {
        required: noArguments,
      },
      status: {
        required: noArguments,
      },
    });

    ValidateJoi.validate(user, SCHEMA)
      .then((data) => {
        res.locals.body = data;
        next();
      })
      .catch((error) =>
        next({ ...error, message: "Định dạng gửi đi không đúng" })
      );
  },
  authenUpdate: (req, res, next) => {
    console.log("Validate Create");

    const { password, name, email, mobile, wardsId, status } = req.body;
    const user = { password, email, name, mobile, wardsId, status };

    const SCHEMA = ValidateJoi.assignSchema(DEFAULT_SCHEMA, {
      password: {
        min: 6,
        max: 100,
      },
      name: {
        max: 100,
      },
      email: {
        regex: regexPattern.email,
        max: 100,
      },
      mobile: {
        regex: regexPattern.phoneNumberVie,
        max: 12,
      },
    });

    ValidateJoi.validate(user, SCHEMA)
      .then((data) => {
        res.locals.body = data;
        next();
      })
      .catch((error) =>
        next({ ...error, message: "Định dạng gửi đi không đúng" })
      );
  },

  authenFilter: (req, res, next) => {
    const { filter, sort, range } = req.query;

    res.locals.sort = sort
      ? JSON.parse(sort).map((e, i) =>
          i === 0 ? sequelize.literal(`\`${e}\``) : e
        )
      : ["id", "asc"];
    res.locals.range = range ? JSON.parse(range) : [0, 49];

    console.log("res.locals: ", res.locals);
    if (filter) {
      const {
        id,
        username,
        name,
        email,
        mobile,
        wardsId,
        status,
        FromDate,
        groupUsersId,
        ToDate,
      } = JSON.parse(filter);
      const user = {
        id,
        username,
        name,
        email,
        mobile,
        wardsId,
        groupUsersId,
        status,
        FromDate,
        ToDate,
      };

      const SCHEMA = {
        id: ValidateJoi.createSchemaProp({
          string: noArguments,
          label: viMessage["api.users.id"],
          regex: regexPattern.listIds,
        }),
        ...DEFAULT_SCHEMA,
        wardsId: ValidateJoi.createSchemaProp({
          string: noArguments,
          label: viMessage.wardsId,
          regex: regexPattern.listIds,
        }),
        groupUsersId: ValidateJoi.createSchemaProp({
          string: noArguments,
          label: viMessage.groupUsersId,
          regex: regexPattern.listIds,
        }),
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
      ValidateJoi.validate(user, SCHEMA)
        .then((data) => {
          console.log("data: ", data);
          if (id) {
            ValidateJoi.transStringToArray(data, "id");
          }
          if (wardsId) {
            ValidateJoi.transStringToArray(data, "wardsId");
          }

          res.locals.filter = data;
          console.log("locals.filter", res.locals.filter);
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
