/* jshint indent: 1 */

module.exports = function (sequelize, DataTypes) {
  return sequelize.define(
    "users",
    {
      id: {
        type: DataTypes.BIGINT,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
        field: "id",
      },
      username: {
        type: DataTypes.STRING(50),
        allowNull: false,
        field: "username",
      },
      password: {
        type: DataTypes.STRING(100),
        allowNull: false,
        field: "password",
      },
      name: {
        type: DataTypes.STRING(100),
        allowNull: false,
        field: "name",
      },
      email: {
        type: DataTypes.STRING(200),
        allowNull: true,
        field: "email",
      },
      mobile: {
        type: DataTypes.STRING(12),
        allowNull: false,
        field: "mobile",
      },
      sex: {
        type: DataTypes.INTEGER(1),
        allowNull: true,
        field: "sex",
      },
      birthday: {
        type: DataTypes.DATE,
        allowNull: true,
        field: "birthday",
      },
      wardsId: {
        type: DataTypes.BIGINT,
        allowNull: true,
        field: "wards_id",
      },
      groupUsersId: {
        type: DataTypes.BIGINT,
        allowNull: true,
        field: "group_users_id",
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
      tableName: "users",
      timestamps: false,
    }
  );
};
