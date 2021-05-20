import ValidateJoi, { noArguments } from "../utils/validateJoi";
import regexPattern from "../utils/regexPattern";
import viMessage from "../locates/vi";
import { sequelize } from "../db/db";

const DEFAULT_SCHEMA = {
  coursesId: ValidateJoi.createSchemaProp({
    number: noArguments,
    label: viMessage.coursesId,
  }),
  weeksId: ValidateJoi.createSchemaProp({
    number: noArguments,
    label: viMessage.weeksId,
  }),
  numberWeek: ValidateJoi.createSchemaProp({
    number: noArguments,
    label: viMessage["api.courseWeeks.numberWeek"],
  }),
};

export default {
  authenCreate: (req, res, next) => {
    // const usersCreatorId = req.auth.userId;

    // const usersId = req.auth.userId;
    const { coursesId, weeksId, numberWeek } = req.body;
    const courseWeeks = {
      coursesId,
      weeksId,
      numberWeek,
    };

    const SCHEMA = ValidateJoi.assignSchema(DEFAULT_SCHEMA, {
      coursesId: {
        required: noArguments,
      },
      weeksId: {
        required: noArguments,
      },
      numberWeek: {
        required: noArguments,
      },
    });

    // console.log('input: ', input);
    ValidateJoi.validate(courseWeeks, SCHEMA)
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

    const { coursesId, weeksId, numberWeek } = req.body;
    const courses = {
      coursesId,
      weeksId,
      numberWeek,
    };

    const SCHEMA = ValidateJoi.assignSchema(DEFAULT_SCHEMA, {
      title: {
        max: 100,
      },
    });

    ValidateJoi.validate(courses, SCHEMA)
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
      const { id, coursesId, weeksId, numberWeek } = JSON.parse(filter);
      const courseWeeks = {
        id,
        coursesId,
        weeksId,
        numberWeek,
      };

      // console.log(district)
      const SCHEMA = {
        id: ValidateJoi.createSchemaProp({
          string: noArguments,
          label: viMessage.courseWeeksId,
          regex: regexPattern.listIds,
        }),
        ...DEFAULT_SCHEMA,
        coursesId: ValidateJoi.createSchemaProp({
          string: noArguments,
          label: viMessage.coursesId,
          regex: regexPattern.listIds,
        }),
        weeksId: ValidateJoi.createSchemaProp({
          string: noArguments,
          label: viMessage.weeksId,
          regex: regexPattern.listIds,
        }),
      };

      // console.log('input: ', input);
      ValidateJoi.validate(courseWeeks, SCHEMA)
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
