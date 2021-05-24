/* jshint indent: 1 */

module.exports = function (sequelize, DataTypes) {
  return sequelize.define(
    "courses",
    {
      id: {
        type: DataTypes.BIGINT,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
        field: "id",
      },
      title: {
        type: DataTypes.STRING(100),
        allowNull: false,
        field: "title",
      },
      level: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
        field: "level",
      },
      skillsId: {
        type: DataTypes.BIGINT,
        allowNull: false,
        field: "skills_id",
      },
      jobsId: {
        type: DataTypes.BIGINT,
        allowNull: false,
        field: "jobs_id",
      },
      categoriesId: {
        type: DataTypes.BIGINT,
        allowNull: false,
        field: "categories_id",
      },
      creatorsId: {
        type: DataTypes.BIGINT,
        allowNull: false,
        field: "creators_id",
      },
      languagesId: {
        type: DataTypes.BIGINT,
        allowNull: false,
        field: "languages_id",
      },
      duration: {
        type: DataTypes.INTEGER(11),
        allowNull: false,
        field: "duration",
      },
      cost: {
        type: DataTypes.BIGINT,
        allowNull: false,
        field: "cost",
      },
      description: {
        type: DataTypes.STRING,
        allowNull: false,
        field: "description",
      },
    },
    {
      tableName: "courses",
      timestamps: false,
    }
  );
};
