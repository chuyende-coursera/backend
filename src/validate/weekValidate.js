import ValidateJoi, { noArguments } from "../utils/validateJoi";
import regexPattern from "../utils/regexPattern";
import viMessage from "../locates/vi";
import { sequelize } from "../db/db";

const DEFAULT_SCHEMA = {
  timeComplete: ValidateJoi.createSchemaProp({
    number: noArguments,
    label: viMessage["api.weeks.timeComplete"],
  }),
  header: ValidateJoi.createSchemaProp({
    string: noArguments,
    label: viMessage["api.weeks.header"],
  }),
  description: ValidateJoi.createSchemaProp({
    string: noArguments,
    label: viMessage["api.weeks.description"],
  }),
  coursesId: ValidateJoi.createSchemaProp({
    number: noArguments,
    label: viMessage.coursesId,
  }),
  numberWeek: ValidateJoi.createSchemaProp({
    number: noArguments,
    label: viMessage["api.courseWeeks.numberWeek"],
  }),
};

const VIDEO_WEEKS_SCHEMA = ValidateJoi.createArraySchema(
  ValidateJoi.createObjectSchema({
    videoUrl: ValidateJoi.createSchemaProp({
      string: noArguments,
      required: noArguments,
      label: viMessage["api.videoWeek.videoUrl"],
    }),
    videoHeader: ValidateJoi.createSchemaProp({
      string: noArguments,
      required: noArguments,
      label: viMessage["api.videoWeek.videoHeader"],
    }),
    orderVideo: ValidateJoi.createSchemaProp({
      number: noArguments,
      required: noArguments,
      label: viMessage["api.videoWeek.orderVideo"],
    }),
  })
);

export default {
  authenCreate: (req, res, next) => {
    // const usersCreatorId = req.auth.userId;
    console.log("req: ", req.body);
    // const usersId = req.auth.userId;
    const {
      timeComplete,
      header,
      description,
      videoWeeks,
      coursesId,
      numberWeek,
    } = req.body;
    const weeks = {
      timeComplete,
      header,
      description,
      videoWeeks,
      numberWeek,
      coursesId,
    };
    const SCHEMA = Object.assign(
      ValidateJoi.assignSchema(DEFAULT_SCHEMA, {
        timeComplete: {
          required: noArguments,
        },
        header: {
          required: noArguments,
          max: 100,
        },
        description: {
          required: noArguments,
          max: 500,
        },
        coursesId: {
          required: noArguments,
        },
        numberWeek: {
          required: noArguments,
        },
      }),
      {
        videoWeeks: VIDEO_WEEKS_SCHEMA,
      }
    );

    // console.log('input: ', input);
    ValidateJoi.validate(weeks, SCHEMA)
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

    const {
      timeComplete,
      header,
      description,
      coursesId,
      numberWeek,
    } = req.body;
    const weeks = {
      timeComplete,
      header,
      description,
      coursesId,
      numberWeek,
    };

    const SCHEMA = ValidateJoi.assignSchema(DEFAULT_SCHEMA, {
      header: {
        max: 100,
      },
      description: {
        max: 100,
      },
    });

    ValidateJoi.validate(weeks, SCHEMA)
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
      const { id, timeComplete, header, description } = JSON.parse(filter);
      const weeks = {
        id,
        timeComplete,
        header,
        description,
        coursesId,
        numberWeek,
      };

      // console.log(district)
      const SCHEMA = {
        id: ValidateJoi.createSchemaProp({
          string: noArguments,
          label: viMessage.weeksId,
          regex: regexPattern.listIds,
        }),
        ...DEFAULT_SCHEMA,
        coursesId: ValidateJoi.createSchemaProp({
          string: noArguments,
          label: viMessage.coursesId,
          regex: regexPattern.listIds,
        }),
      };

      // console.log('input: ', input);
      ValidateJoi.validate(weeks, SCHEMA)
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
