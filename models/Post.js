const { Model, DataTypes } = require("sequelize");
const sequelize = require("../config/connection");

class Post extends Model {}

Post.init(
	{
		id: {
			type: DataTypes.INTEGER,
			allowNull: false,
			primaryKey: true,
			autoIncrement: true,
		},
		title: {
			type: DataTypes.STRING,
			allowNull: false,
			validate: {
				len: [1],
			},
		},
		post_body: {
			type: DataTypes.TEXT,
			allowNull: false,
			validate: {
				len: [1],
			},
		},
		user_id: {
			type: DataTypes.INTEGER,
			references: {
				model: "user",
				key: "id",
			},
		},
		created_at: {
			type: DataTypes.DATE,
		},
	},

	{
		sequelize,
		timestamps: false,
		// Prevent sequelize from renaming the table
		freezeTableName: true,
		underscored: true,
		modelName: "post",
	}
);

module.exports = Post;
