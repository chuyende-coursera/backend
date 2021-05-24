/* jshint indent: 1 */

module.exports = function (sequelize, DataTypes) {
  return sequelize.define(
    "userCourse",
    {
      id: {
        type: DataTypes.BIGINT,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
        field: "id",
      },
      usersId: {
        type: DataTypes.BIGINT,
        allowNull: false,
        field: "usersId",
      },
      coursesId: {
        type: DataTypes.BIGINT,
        allowNull: false,
        field: "coursesId",
      },
      status: {
        type: DataTypes.INTEGER(11),
        allowNull: true,
        field: "status",
        defaultValue: 0,
      },
      review: {
        type: DataTypes.INTEGER(11),
        allowNull: true,
        field: "review",
      },
      comment: {
        type: DataTypes.STRING(100),
        allowNull: true,
        field: "comment",
      },
    },
    {
      tableName: "user_course",
      timestamps: false,
    }
  );
};
