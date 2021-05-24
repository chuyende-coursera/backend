/* jshint indent: 1 */

module.exports = function (sequelize, DataTypes) {
  return sequelize.define(
    "topics",
    {
      id: {
        type: DataTypes.BIGINT,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
        field: "id",
      },
      name: {
        type: DataTypes.STRING(50),
        allowNull: false,
        field: "name",
      },
      usersId: {
        type: DataTypes.BIGINT,
        allowNull: false,
        field: "users_id",
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
      tableName: "topics",
      timestamps: false,
    }
  );
};
