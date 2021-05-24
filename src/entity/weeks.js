/* jshint indent: 1 */

module.exports = function (sequelize, DataTypes) {
  return sequelize.define(
    "weeks",
    {
      id: {
        type: DataTypes.BIGINT,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
        field: "id",
      },
      timeComplete: {
        type: DataTypes.INTEGER(11),
        allowNull: false,
        field: "time_complete",
      },
      header: {
        type: DataTypes.STRING(100),
        allowNull: false,
        field: "header",
      },
      description: {
        type: DataTypes.STRING(100),
        allowNull: false,
        field: "description",
      },
      coursesId: {
        type: DataTypes.BIGINT,
        allowNull: false,
        field: "courses_id",
      },
      numberWeek: {
        type: DataTypes.INTEGER(11),
        allowNull: false,
        field: "number_week",
      },
    },
    {
      tableName: "weeks",
      timestamps: false,
    }
  );
};
