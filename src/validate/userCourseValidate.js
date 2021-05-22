import ValidateJoi, { noArguments } from "../utils/validateJoi";
import regexPattern from "../utils/regexPattern";
import viMessage from "../locates/vi";
import { sequelize } from "../db/db";

const DEFAULT_SCHEMA = {
  usersId: ValidateJoi.createSchemaProp({
    number: noArguments,
    label: viMessage.usersId,
  }),
  coursesId: ValidateJoi.createSchemaProp({
    number: noArguments,
    label: viMessage.coursesId,
  }),
  review: ValidateJoi.createSchemaProp({
    number: noArguments,
    label: viMessage["api.userCourse.review"],
  }),
  comment: ValidateJoi.createSchemaProp({
    string: noArguments,
    label: viMessage["api.userCourse.comment"],
  }),
  status: ValidateJoi.createSchemaProp({
    number: noArguments,
    label: viMessage.status,
  }),
};

export default {
  authenCreate: (req, res, next) => {
    // const usersCreatorId = req.auth.userId;

    const usersId = req.auth.userId;
    console.log("req body: ", req.body);
    const { coursesId, status, review, comment } = req.body;
    const userCourse = {
      usersId,
      coursesId,
      status,
      review,
      comment,
    };
    console.log("userCourse: ", userCourse);

    const SCHEMA = ValidateJoi.assignSchema(DEFAULT_SCHEMA, {
      usersId: {
        required: noArguments,
      },
      coursesId: {
        required: noArguments,
      },
    });

    // console.log('input: ', input);
    ValidateJoi.validate(userCourse, SCHEMA)
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

    const { status, review, comment } = req.body;
    const userCourse = { status, review, comment };

    const SCHEMA = ValidateJoi.assignSchema(DEFAULT_SCHEMA, {});

    ValidateJoi.validate(userCourse, SCHEMA)
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
      const { id, usersId, coursesId, status, review, comment } = JSON.parse(
        filter
      );
      const userCourse = { id, usersId, coursesId, status, review, comment };

      // console.log(district)
      const SCHEMA = {
        id: ValidateJoi.createSchemaProp({
          string: noArguments,
          label: viMessage["api.topics.id"],
          regex: regexPattern.listIds,
        }),
        ...DEFAULT_SCHEMA,
        userId: ValidateJoi.createSchemaProp({
          string: noArguments,
          label: viMessage.usersId,
          regex: regexPattern.listIds,
        }),
        coursesId: ValidateJoi.createSchemaProp({
          string: noArguments,
          label: viMessage.coursesId,
          regex: regexPattern.listIds,
        }),
      };

      // console.log('input: ', input);
      ValidateJoi.validate(userCourse, SCHEMA)
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
