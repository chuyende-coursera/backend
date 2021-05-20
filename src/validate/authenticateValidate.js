import ValidateJoi, { noArguments } from "../utils/validateJoi";
import viMessage from "../locates/vi";
import regexPattern from "../utils/regexPattern";

const DEFAULT_SCHEMA = {
  username: ValidateJoi.createSchemaProp({
    string: noArguments,
    label: viMessage["api.users.username"]
  }),
  password: ValidateJoi.createSchemaProp({
    string: noArguments,
    label: viMessage["api.users.password"]
  })
};

export default {
  authenCreate: (req, res, next) => {
    console.log("Validate Create");

    const {
      username,
      password,
    } = req.body;
    const user = { username, password};

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
    });

    ValidateJoi.validate(user, SCHEMA)
    .then(data => {
        res.locals.body = data;
        next()
    })
    .catch(error => next({...error, message: "Định dạng gửi đi không đúng" }))
  },
};
