/* jshint indent: 1 */

module.exports = function (sequelize, DataTypes) {
  return sequelize.define(
    "languages",
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
    },
    {
      tableName: "languages",
      timestamps: false,
    }
  );
};
