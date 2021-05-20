import ValidateJoi, { noArguments } from "../utils/validateJoi";
import regexPattern from "../utils/regexPattern";
import viMessage from "../locates/vi";
import { sequelize } from "../db/db";

const DEFAULT_SCHEMA = {
  title: ValidateJoi.createSchemaProp({
    string: noArguments,
    label: viMessage["api.courses.title"],
  }),
  level: ValidateJoi.createSchemaProp({
    number: noArguments,
    label: viMessage["api.courses.level"],
  }),
  skillsId: ValidateJoi.createSchemaProp({
    number: noArguments,
    label: viMessage.skillsId,
  }),
  jobsId: ValidateJoi.createSchemaProp({
    number: noArguments,
    label: viMessage.jobsId,
  }),
  categoriesId: ValidateJoi.createSchemaProp({
    number: noArguments,
    label: viMessage.categoriesId,
  }),
  creatorsId: ValidateJoi.createSchemaProp({
    number: noArguments,
    label: viMessage.creatorsId,
  }),
  languagesId: ValidateJoi.createSchemaProp({
    number: noArguments,
    label: viMessage.languagesId,
  }),
  duration: ValidateJoi.createSchemaProp({
    number: noArguments,
    label: viMessage["api.courses.duration"],
  }),
  cost: ValidateJoi.createSchemaProp({
    number: noArguments,
    label: viMessage["api.courses.cost"],
  }),
  description: ValidateJoi.createSchemaProp({
    string: noArguments,
    label: viMessage["api.courses.description"],
  }),
};

export default {
  authenCreate: (req, res, next) => {
    // const usersCreatorId = req.auth.userId;

    const creatorsId = req.auth.userId;
    const {
      title,
      level,
      skillsId,
      jobsId,
      categoriesId,
      languagesId,
      duration,
      cost,
      description,
    } = req.body;
    const courses = {
      title,
      level,
      skillsId,
      jobsId,
      categoriesId,
      creatorsId,
      languagesId,
      duration,
      cost,
      description,
    };

    const SCHEMA = ValidateJoi.assignSchema(DEFAULT_SCHEMA, {
      title: {
        required: noArguments,
        max: 100,
      },
      level: {
        required: noArguments,
      },
      skillsId: {
        required: noArguments,
      },
      jobsId: {
        required: noArguments,
      },
      categoriesId: {
        required: noArguments,
      },
      creatorsId: {
        required: noArguments,
      },
      languagesId: {
        required: noArguments,
      },
      duration: {
        required: noArguments,
      },
    });

    // console.log('input: ', input);
    ValidateJoi.validate(courses, SCHEMA)
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
      title,
      level,
      skillsId,
      jobsId,
      categoriesId,
      creatorsId,
      languagesId,
      duration,
      cost,
      description,
    } = req.body;
    const courses = {
      title,
      level,
      skillsId,
      jobsId,
      categoriesId,
      creatorsId,
      languagesId,
      duration,
      cost,
      description,
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
      const {
        id,
        title,
        level,
        skillsId,
        jobsId,
        categoriesId,
        creatorsId,
        languagesId,
        duration,
        cost,
      } = JSON.parse(filter);
      const courses = {
        id,
        title,
        level,
        skillsId,
        jobsId,
        categoriesId,
        creatorsId,
        languagesId,
        duration,
        cost,
      };

      // console.log(district)
      const SCHEMA = {
        id: ValidateJoi.createSchemaProp({
          string: noArguments,
          label: viMessage.coursesId,
          regex: regexPattern.listIds,
        }),
        ...DEFAULT_SCHEMA,
        skillsId: ValidateJoi.createSchemaProp({
          string: noArguments,
          label: viMessage.skillsId,
          regex: regexPattern.listIds,
        }),
        jobsId: ValidateJoi.createSchemaProp({
          string: noArguments,
          label: viMessage.jobsId,
          regex: regexPattern.listIds,
        }),
        categoriesId: ValidateJoi.createSchemaProp({
          string: noArguments,
          label: viMessage.categoriesId,
          regex: regexPattern.listIds,
        }),
        creatorsId: ValidateJoi.createSchemaProp({
          string: noArguments,
          label: viMessage.creatorsId,
          regex: regexPattern.listIds,
        }),
        languagesId: ValidateJoi.createSchemaProp({
          string: noArguments,
          label: viMessage.languagesId,
          regex: regexPattern.listIds,
        }),
      };

      // console.log('input: ', input);
      ValidateJoi.validate(courses, SCHEMA)
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
