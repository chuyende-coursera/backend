import ValidateJoi, { noArguments } from "../utils/ValidateJoi";
import viMessage from "../locates/vi";
import { sequelize } from "../db/db";
import regexPattern from "../utils/regexPattern";

const DEFAULT_SCHEMA = {
  username: ValidateJoi.createSchemaProp({
    string: noArguments,
    label: viMessage["api.users.username"]
  }),
  password: ValidateJoi.createSchemaProp({
    string: noArguments,
    label: viMessage["api.users.password"]
  }),
  name: ValidateJoi.createSchemaProp({
    string: noArguments,
    label: viMessage["api.users.name"]
  }),
  email: ValidateJoi.createSchemaProp({
    string: noArguments,
    label: viMessage["api.users.email"],
    allow: ["", null]
  }),
  mobile: ValidateJoi.createSchemaProp({
    string: noArguments,
    label: viMessage["api.users.mobile"]
  }),
  wardsId: ValidateJoi.createSchemaProp({
    number: noArguments,
    label: viMessage.wardsId,
    integer: noArguments
  }),
  status: ValidateJoi.createSchemaProp({
    boolean: noArguments,
    label: viMessage.status
  })
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
      status
    } = req.body;
    const user = { username, password, email, name, mobile, wardsId, status };

    const SCHEMA = ValidateJoi.assignSchema(DEFAULT_SCHEMA, {
      username: {
        regex: /\w/i,
        max: 50,
        required: noArguments
      },
      password: {
        min: 6,
        max: 100,
        required: noArguments
      },
      wardsId: {
        required: noArguments
      },
      name: {
        max: 100,
        required: noArguments
      },
      email: {
        regex: regexPattern.email,
        max: 100
      },
      mobile: {
        regex: regexPattern.phoneNumberVie,
        max: 12
      },
      wardsId: {
        required: noArguments
      },
      status: {
        required: noArguments
      }
    });

    ValidateJoi.validate(user, SCHEMA)
    .then(data => {
        res.locals.body = data;
        next()
    })
    .catch(error => next({...error, message: "Định dạng gửi đi không đúng" }))
  }
};
