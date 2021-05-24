/* jshint indent: 1 */

module.exports = function (sequelize, DataTypes) {
  return sequelize.define(
    "groupUsers",
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
        allowNull: true,
        field: "name",
      },
      createDate: {
        type: DataTypes.DATE,
        allowNull: true,
        defaultValue: sequelize.literal("CURRENT_TIMESTAMP"),
        field: "create_date",
      },
      status: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        field: "status",
      },
    },
    {
      tableName: "group_users",
      timestamps: false,
    }
  );
};
