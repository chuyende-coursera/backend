/* jshint indent: 1 */

module.exports = function (sequelize, DataTypes) {
  return sequelize.define(
    "categories",
    {
      id: {
        type: DataTypes.BIGINT,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
        field: "id",
      },
      name: {
        type: DataTypes.STRING(100),
        allowNull: false,
        field: "name",
      },
      topicsId: {
        type: DataTypes.BIGINT,
        allowNull: false,
        field: "topics_id",
      },
    },
    {
      tableName: "categories",
      timestamps: false,
    }
  );
};
