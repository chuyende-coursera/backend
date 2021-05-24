import ValidateJoi, { noArguments } from "../utils/validateJoi";
import regexPattern from "../utils/regexPattern";
import viMessage from "../locates/vi";
import { sequelize } from "../db/db";

const DEFAULT_SCHEMA = {
  videoUrl: ValidateJoi.createSchemaProp({
    string: noArguments,
    label: viMessage["api.videoWeek.videoUrl"],
  }),
  videoHeader: ValidateJoi.createSchemaProp({
    string: noArguments,
    label: viMessage["api.videoWeek.videoHeader"],
  }),
  orderVideo: ValidateJoi.createSchemaProp({
    number: noArguments,
    label: viMessage["api.videoWeek.orderVideo"],
  }),
  durationVideo: ValidateJoi.createSchemaProp({
    number: noArguments,
    label: viMessage["api.videoWeek.durationVideo"],
  }),
  weeksId: ValidateJoi.createSchemaProp({
    number: noArguments,
    label: viMessage.weeksId,
  }),
};

export default {
  authenCreate: (req, res, next) => {
    // const usersCreatorId = req.auth.userId;

    const {
      videoUrl,
      orderVideo,
      videoHeader,
      durationVideo,
      weeksId,
    } = req.body;
    const videoWeek = {
      videoUrl,
      orderVideo,
      videoHeader,
      durationVideo,
      weeksId,
    };

    const SCHEMA = ValidateJoi.assignSchema(DEFAULT_SCHEMA, {
      videoUrl: {
        required: noArguments,
        max: 500,
      },
      videoHeader: {
        required: noArguments,
        max: 100,
      },
      orderVideo: {
        required: noArguments,
      },
      durationVideo: {
        required: noArguments,
      },
      weeksId: {
        required: noArguments,
      },
    });

    // console.log('input: ', input);
    ValidateJoi.validate(videoWeek, SCHEMA)
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
      videoUrl,
      orderVideo,
      videoHeader,
      durationVideo,
      weeksId,
    } = req.body;
    const videoWeek = {
      videoUrl,
      orderVideo,
      videoHeader,
      durationVideo,
      weeksId,
    };

    const SCHEMA = ValidateJoi.assignSchema(DEFAULT_SCHEMA, {
      videoUrl: {
        max: 500,
      },
      videoHeader: {
        max: 100,
      },
    });

    ValidateJoi.validate(videoWeek, SCHEMA)
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
        videoUrl,
        orderVideo,
        videoHeader,
        durationVideo,
        weeksId,
      } = JSON.parse(filter);
      const videoWeek = {
        id,
        videoUrl,
        orderVideo,
        videoHeader,
        durationVideo,
        weeksId,
      };

      // console.log(district)
      const SCHEMA = {
        id: ValidateJoi.createSchemaProp({
          string: noArguments,
          label: viMessage.videoWeekId,
          regex: regexPattern.listIds,
        }),
        ...DEFAULT_SCHEMA,
        weeksId: ValidateJoi.createSchemaProp({
          string: noArguments,
          label: viMessage.weeksId,
          regex: regexPattern.listIds,
        }),
      };

      // console.log('input: ', input);
      ValidateJoi.validate(videoWeek, SCHEMA)
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
