/* jshint indent: 1 */

module.exports = function (sequelize, DataTypes) {
  return sequelize.define(
    "videoWeek",
    {
      id: {
        type: DataTypes.BIGINT,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
        field: "id",
      },
      videoUrl: {
        type: DataTypes.STRING(500),
        allowNull: false,
        field: "video_url",
      },
      orderVideo: {
        type: DataTypes.INTEGER(11),
        allowNull: false,
        field: "order_video",
      },
      videoHeader: {
        type: DataTypes.STRING(100),
        allowNull: false,
        field: "video_header",
      },
      durationVideo: {
        type: DataTypes.INTEGER(11),
        allowNull: false,
        field: "duration_video",
      },
      weeksId: {
        type: DataTypes.BIGINT,
        allowNull: false,
        field: "weeks_id",
      },
    },
    {
      tableName: "video_week",
      timestamps: false,
    }
  );
};
