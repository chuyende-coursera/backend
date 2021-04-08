/* jshint indent: 1 */

module.exports = function(sequelize, DataTypes) {
	return sequelize.define('users', {
		id: {
			type: DataTypes.BIGINT,
			allowNull: false,
			primaryKey: true,
			autoIncrement: true,
			field: 'id'
		},
		username: {
			type: DataTypes.STRING(50),
			allowNull: false,
			field: 'username'
		},
		password: {
			type: DataTypes.STRING(100),
			allowNull: false,
			field: 'password'
		},
		name: {
			type: DataTypes.STRING(100),
			allowNull: false,
			field: 'name'
		},
		email: {
			type: DataTypes.STRING(200),
			allowNull: false,
			field: 'email'
		},
		mobile: {
			type: DataTypes.STRING(12),
			allowNull: false,
			field: 'mobile'
		},
		placesId: {
			type: DataTypes.BIGINT,
			allowNull: false,
			field: 'places_id'
		},
		sex: {
			type: DataTypes.INTEGER(1),
			allowNull: false,
			field: 'sex'
		},
		birthday: {
			type: DataTypes.DATE,
			allowNull: true,
			field: 'birthday'
		},
		wardsId: {
			type: DataTypes.BIGINT,
			allowNull: false,
			field: 'wards_id'
		},
		createDate: {
			type: DataTypes.DATE,
			allowNull: false,
			defaultValue: sequelize.literal('CURRENT_TIMESTAMP'),
			field: 'create_date'
		},
		status: {
			type: DataTypes.BOOLEAN,
			allowNull: false,
			field: 'status'
		},
	}, {
		tableName: 'users',
		timestamps: false
	});
};
