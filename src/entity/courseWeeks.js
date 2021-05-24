/* jshint indent: 1 */

module.exports = function (sequelize, DataTypes) {
  return sequelize.define(
    "courseWeeks",
    {
      id: {
        type: DataTypes.BIGINT,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
        field: "id",
      },
      coursesId: {
        type: DataTypes.BIGINT,
        allowNull: false,
        field: "courses_id",
      },
      weeksId: {
        type: DataTypes.BIGINT,
        allowNull: false,
        field: "weeks_id",
      },
      numberWeek: {
        type: DataTypes.INTEGER(11),
        allowNull: false,
        field: "number_week",
      },
    },
    {
      tableName: "course_weeks",
      timestamps: false,
    }
  );
};
